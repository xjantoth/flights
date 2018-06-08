import os
import json
import time
import auth
import socket
import numpy as np
import datetime
import requests
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from pandas.io.json import json_normalize
pd.set_option('display.max_colwidth', -1)

# from IPython.core.display import display, HTML
# display(HTML("<style>.container { width:100% !important; }</style>"))

def get_token(_auth_data, _url_token):
    _auth_data = json.dumps(_auth_data)
    response = requests.post(
        _url_token,
        data=_auth_data
    )
    _token = response.json()['data']['user']['data']['auth_token']
    return _token


def get_data(_token, _url_list):
    _headers = {'Authorization': 'token' + ' ' + _token}
    _r = requests.post(
        _url_list,
        headers=_headers
    )
    return _r.json()

def determine_direction(x):
    x = str(x)
    if x == "BTS" or x == "KSC" or x == "SLD" or x == "TAT":
        return str("TAM")
    else:
        return str("SPAT")

def determine_production(x):
    x = str(x)
    if x == "BTS":
        return str("BTS")
    elif x == "KSC":
        return str("KSC")
    else:
        return str("---")
    
def extra_catering(x):
    try:
        _count = x[0]['count']
        return _count
    except:
        return 0

def extra_catering_code(x):
    try:
        _code = x[0]['code']
        return _code
    except:
        return 0    
    
   
        
def render_tables(_data):
    _df = json_normalize(_data['data']['flight']['data'])
    _compare = pd.DataFrame()
    _compare['flight_number'] = _df['flight_number']
    _compare['aircraft_config'] = _df['aircraft_config']
    _compare['aircraft_reg'] = _df['aircraft_reg']
    _compare['local_departure'] = pd.to_datetime(_df['local_std_date'] + ' ' + _df['local_std_time'])
    _compare['xDeparture'] = _compare['local_departure']
    _compare['local_arrival'] = pd.to_datetime(_df['local_sta_date'] + ' ' + _df['local_sta_time'])    
    _compare["catering_order.flight_meal_type"] = _df["catering_order.flight_meal_type"]
    _compare['smer'] = _df['departure_iata'].map(determine_direction)
    _compare['produkcia'] = _df['departure_iata'].map(determine_production)
    _compare['departure_iata'] = _df['departure_iata']
    _compare['destination_iata'] = _df['destination_iata']
    _compare['catering_order.quantity_y'] = _df['catering_order.quantity_y']
    _compare['catering_order.quantity_crew'] = _df['catering_order.quantity_crew']
    _compare['Extra Count'] = _df['extra_catering'].map(extra_catering)
    _compare['Extra Code'] = _df['extra_catering'].map(extra_catering_code)
    
    div_start = """<div class="hoverable">"""
    div_end = "</div>"
    _compare['catering_order.general_note'] = _df['catering_order.general_note'].map(lambda x: "{0}{1}{2}".format(div_start, str(x), div_end))
    _compare['catering_order.general_note'] = _compare['catering_order.general_note'].map(lambda x: str(x).replace('\n', "<br>"))
    _compare['catering_order.general_note'] = _compare['catering_order.general_note'].map(lambda x: str(x).replace('\r', ''))
    _compare = _compare.sort_values(['local_departure', 'catering_order.flight_meal_type'],ascending=[True, True])
    
    # exchange NaN to 0
    _compare['catering_order.quantity_y'] = _compare['catering_order.quantity_y'].fillna(0)
    _compare['catering_order.quantity_crew'] = _compare['catering_order.quantity_crew'].fillna(0)
    # Rename columns 
    _compare = _compare.rename(columns={'flight_number':'Flight'})   
    _compare = _compare.rename(columns={'catering_order.flight_meal_type':'Meal'})   
    _compare = _compare.rename(columns={'aircraft_config':'Aircraft'})
    _compare = _compare.rename(columns={'aircraft_reg':'Reg'})
    _compare = _compare.rename(columns={'local_departure':'Departure'})
    _compare = _compare.rename(columns={'local_arrival':'Arrival'})
    _compare = _compare.rename(columns={'departure_iata':'FROM'})
    _compare = _compare.rename(columns={'destination_iata':'TO'})
    _compare = _compare.rename(columns={'catering_order.quantity_y':'Quantity'})
    _compare = _compare.rename(columns={'catering_order.quantity_crew':'Crew'})
#     _compare = _compare.rename(columns={'extra_catering':'Extra'})
    _compare = _compare.rename(columns={'catering_order.general_note':'Poznamka'})
    
    _compare.index = _compare['Departure']
    
    _allUniqueDays = _df['local_std_date'].unique()
    _allUniqueDays = np.sort(_allUniqueDays)
    _allUniqueReg = _df['aircraft_reg'].unique()
    # sort_values(["Reg","xDeparture"], ascending=True)
    tables = {}
    for i in _allUniqueDays:
        # split _comapre dataframe by days first
        temp_table_day_chunck = _compare.loc[i]
        # taking partuicular day and sorting it by 'aircraft_reg' and then by 'departure date'
        # splitting particular day into unique 'aircraft_reg' - something like car plates :)
        temp_storage = {}
        for _reg in _allUniqueReg:
            
            sorting_particular_day_df = temp_table_day_chunck.sort_values(["Reg","xDeparture"], ascending=True)
            try:
                is_dataframe = sorting_particular_day_df.loc[sorting_particular_day_df['Reg'] == _reg]
                if not is_dataframe.empty:
                    temp_storage[_reg] = sorting_particular_day_df.loc[sorting_particular_day_df['Reg'] == _reg]
                # data.loc[data['first_name'] == 'Antonio', 'city':'email']
                
            except Exception as missing_reg:
                # print('This {} for date: {} is missing.'.format(_reg, i))
                temp_storage[_reg] = "<empty>"
            
        tables[i] = temp_storage
        
        
    # ****************************************************************
    # tables = {"2018-06-03": ".......", "2018-06-04": ".......", ...}
    # ****************************************************************
    return tables, _allUniqueDays, _compare, _df, _allUniqueReg


def process_tables_to_html(_tables, _allUniqueDays, _allUniqueReg):
    tables_html_aggr = {}
    tables_html_list = {}
    
    for k in _allUniqueDays:    
        # aggregation table - little 
        temp_aggr_dict = {}
        temp_list_table_dict = {}
        for _reg in _allUniqueReg:
            try:
                temp_aggr = _tables[k][_reg].groupby(['Meal','smer']).sum()
                temp_aggr_dict[_reg] = temp_aggr.to_html(classes="table table-sm table-hover table-striped table-responsive", escape=False)
            except Exception as aggr_exists_error:
                pass
                # print('No such REG key: {}'.format(aggr_exists_error))
                
            try:
                # Remove column
                remove_column = _tables[k][_reg].drop('Departure', axis=1)
                # Remove empty row 
                temp_list_table_dict[_reg] = remove_column.to_html(classes="table table-sm table-hover table-striped table-responsive-xl", escape=False)
                
            except Exception as list_table_error:
                pass
                # print('No such REG key for list view: {}'.format(list_table_error))
        
        tables_html_aggr[k] = temp_aggr_dict
        tables_html_list[k] = temp_list_table_dict
        
    return tables_html_list, tables_html_aggr, allUniqueDays
        
        
def create_files(_tables_html_list, 
                _tables_html_aggr, 
                _allUniqueDays,
                _path_template,
                _day_tamplate):
    
    for _day in np.sort(allUniqueDays):
        j2_env = Environment(loader=FileSystemLoader(_path_template))
        _data = j2_env.get_template(_day_tamplate).render(particular_day_content_list=_tables_html_list[_day],
                                                          particular_day_content_aggr=_tables_html_aggr[_day]
                                                          )
        _filename = str(_day + ".html")
        if socket.gethostname() != "nb-toth":
            _serve = 'twowings'
            _oname = os.path.join(_path_template, _serve, _filename)
        else:
            _oname = os.path.join(_path_template, _filename)
        with open(_oname, 'w') as f:
            f.write(_data)
            
def create_main(_path_template,
                _main_tamplate,
                _unique_days):
    
    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _data = j2_env.get_template(_main_tamplate).render(unique_days=_unique_days, timeStamp=ts) 
    _filename = str("index.html")
    if socket.gethostname() != "nb-toth":
        _serve = 'twowings'
        _omain = os.path.join(_path_template, _serve, _filename)
    else:
        _omain = os.path.join(_path_template, _filename)
        print('saving to {}'.format(_omain))
    with open(_omain, 'w') as f:
        f.write(_data)
        

def get_cred():    
    password = auth.login['password']
    username = auth.login['username']
    url_token = auth.login['url_token']
    url_list = auth.login['url_list']

    auth_data = {
        'auth_company': 'TVS',
        'auth_username': username,
        'auth_password': password
    }
    return auth_data, url_token, url_list


path_template = "C:\\Users\\jan.toth\\Documents\\2w"
linux_template = "/opt/twowings"
day_tamplate = "particular_day.tpl"
main_template = "main.tpl"
sleep_period = 300

if socket.gethostname() != "nb-toth":
    while True:
        try:
            auth_data, url_token, url_list = get_cred()
            token = get_token(auth_data, url_token)
            render = get_data(token, url_list)
            tables, allUniqueDays, dataframe, plain, allUniqueReg = render_tables(render)
            listx, aggrx, udays = process_tables_to_html(tables, allUniqueDays, allUniqueReg)
            create_files(listx, aggrx, udays, linux_template, day_tamplate)
            create_main(linux_template, main_template, udays)
            time.sleep(sleep_period)
        except Exception as e:
            with open('error_log.txt', 'a') as f:
                tstr = time.strftime("%Y_%m_%d_%H_%M_%S")
                f.write('{}: {}\n'.format(tstr, e))
            time.sleep(sleep_period)

        
if socket.gethostname() == "nb-toth":  
    auth_data, url_token, url_list = get_cred()
    token = get_token(auth_data, url_token)
    render = get_data(token, url_list)
    tables, allUniqueDays, dataframe, plain, allUniqueReg = render_tables(render)
    listx, aggrx, udays = process_tables_to_html(tables, allUniqueDays, allUniqueReg)
    create_files(listx, aggrx, udays, path_template, day_tamplate)
    create_main(path_template, main_template, udays)
    print("Done!")

