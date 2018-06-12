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

    _compare['Departure'] = pd.to_datetime(_df['local_std_date'] + ' ' + _df['local_std_time'])
    _compare['Depart'] = _compare['Departure']
    _compare['Arrival'] = pd.to_datetime(_df['local_sta_date'] + ' ' + _df['local_sta_time'])
    _compare['Flight'] = _df['flight_number']
    _compare['Aircraft'] = _df['aircraft_config']
    _compare['Reg'] = _df['aircraft_reg']
    _compare["Meal"] = _df["catering_order.flight_meal_type"]
    _compare['Direction'] = _df['departure_iata'].map(determine_direction)
    _compare['Production'] = _df['departure_iata'].map(determine_production)
    _compare['From'] = _df['departure_iata']
    _compare['To'] = _df['destination_iata']
    _compare['Quantity'] = _df['catering_order.quantity_y']
    _compare['Crew'] = _df['catering_order.quantity_crew']
    _compare['Extra Count'] = _df['extra_catering'].map(extra_catering)
    _compare['Extra Code'] = _df['extra_catering'].map(extra_catering_code)
    #_compare['Extra Plain'] = _df['extra_catering']

    div_start = """<div class="hoverable">"""
    div_end = "</div>"
    _compare['Note'] = _df['catering_order.general_note'].map(lambda x: "{0}{1}{2}".format(div_start, str(x), div_end))
    _compare['Note'] = _compare['Note'].map(lambda x: str(x).replace('\n', "<br>"))
    _compare['Note'] = _compare['Note'].map(lambda x: str(x).replace('\r', ''))
    # _compare = _compare.sort_values(['Departure', 'Meal'],ascending=[True, True])
    _compare['Quantity'] = _compare['Quantity'].fillna(0)
    _compare['Crew'] = _compare['Crew'].fillna(0)

    _compare.index = _compare['Departure']

    _allUniqueDays = _df['local_std_date'].unique()
    _allUniqueDays = np.sort(_allUniqueDays)
    _allUniqueReg = _df['aircraft_reg'].unique()

    tables = {}
    _list_view_by_dates = {}
    for i in _allUniqueDays:
        # split _comapre dataframe by days first
        temp_table_day_chunck = _compare.loc[i]
        _list_view_by_dates[i] = temp_table_day_chunck
        # taking partuicular day and sorting it by 'aircraft_reg' and then by 'departure date'
        # splitting particular day into unique 'aircraft_reg' - something like car plates :)
        temp_storage = {}
        for _reg in _allUniqueReg:

            sorting_particular_day_df = temp_table_day_chunck.sort_values(["Reg","Depart"], ascending=True)
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
    # _list_view_by_dates = {"2018-06-03": "...", "2018-06-04": "....", ...}
    # ****************************************************************
    return tables, _allUniqueDays, _compare, _df, _allUniqueReg, _list_view_by_dates


def process_tables_to_html(_tables, _allUniqueDays, _allUniqueReg, _list_view_by_dates):
    tables_html_aggr = {}
    tables_html_list = {}
    _detail_aggr = {}
    _detail_list = {}

    for k in _allUniqueDays:
        # aggregation table - little
        # This is Detail page for each day in the second NAVBAR
        _detail_aggr[k] = _list_view_by_dates[k].groupby(['Meal','Direction']).sum().to_html(classes="table table-sm table-hover table-striped table-responsive", escape=False)
        # _compare = _compare.sort_values(['Departure', 'Meal'],ascending=[True, True])
        # _detail_list[k] = _list_view_by_dates[k].sort_values(['Departure', 'Meal'],ascending=[True, True]).drop('Departure', axis=1).to_html(classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False, index=False)
        _detail_list[k] = _list_view_by_dates[k].sort_values(['Reg', 'Depart'],ascending=[True, True]).drop('Departure', axis=1).to_html(classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False, index=False)
        
        temp_aggr_dict = {}
        temp_list_table_dict = {}
        for _reg in _allUniqueReg:
            try:
                temp_aggr = _tables[k][_reg].groupby(['Meal','Direction']).sum()
                temp_aggr_dict[_reg] = temp_aggr.to_html(classes="table table-sm table-hover table-striped table-responsive", escape=False)
            except Exception as aggr_exists_error:
                pass
                # print('No such REG key: {}'.format(aggr_exists_error))

            try:
                # Remove column
                removed_column = _tables[k][_reg].drop('Departure', axis=1)
                # Remove empty row
                temp_list_table_dict[_reg] = removed_column.to_html(classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False, index=False)

            except Exception as list_table_error:
                pass
                # print('No such REG key for list view: {}'.format(list_table_error))
        # ******************************************



        tables_html_aggr[k] = temp_aggr_dict
        tables_html_list[k] = temp_list_table_dict

    return tables_html_list, tables_html_aggr, allUniqueDays, _detail_aggr, _detail_list


def create_files_main_dates(_tables_html_list,
                _tables_html_aggr,
                _allUniqueDays,
                _path_template,
                _day_tamplate,
                _allUniqueReg):
    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    for _day in np.sort(allUniqueDays):
        j2_env = Environment(loader=FileSystemLoader(_path_template))
        # unique set of REGs
        _ureg = list(listx[_day].keys())
        _data = j2_env.get_template(_day_tamplate).render(particular_day_content_list=_tables_html_list[_day],
                                                          particular_day_content_aggr=_tables_html_aggr[_day],
                                                          unique_reg=_ureg,
                                                          xday=_day,
                                                          timeStamp=ts)

        _filename = str(_day + ".html")
        if socket.gethostname() != "nb-toth":
            _serve = 'twowings'
            _oname = os.path.join(_path_template, _serve, _filename)
        else:
            _oname = os.path.join(_path_template, _filename)
        with open(_oname, 'w') as f:
            f.write(_data)

def create_files_reg(_tables_html_list,
                     _tables_html_aggr,
                     _allUniqueDays,
                     _path_template,
                     _reg_tamplate,
                     _allUniqueReg,
                     _detail_aggr,
                     _detail_list,
                     _detail_list_view,
                     _list_view_by_dates):
    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    for _day in np.sort(allUniqueDays):
        j2_env = Environment(loader=FileSystemLoader(_path_template))

        # ************************************************************
        _detail_filename = str("detail" + "-"+ _day + ".html")
        
        zerox = ['0.0']
        directionx = ['SPAT']
        tmpx = pd.DataFrame(list_view_by_dates[_day]) 
        tmpx = tmpx[~tmpx.Quantity.isin(zerox)]
        tmpx = tmpx[~tmpx.Direction.isin(directionx)]

        tmpx = pd.DataFrame(tmpx.groupby(['Meal','Direction']).count().iloc[:,1])
        _special_quantity = {k[0]:[v, int(v)*189] for k,v in tmpx.to_dict()['Depart'].items()}
        
        # _special_quantity = pd.DataFrame(_list_view_by_dates[_day].groupby(['Meal','Direction']).count().iloc[:,1])  
        # _special_quantity = {k[0]:[v, int(v)*189] for k,v in _special_quantity.to_dict()['Depart'].items() if k[1] == "TAM"}
        # print('_special_quantity:{} -> {}'.format(_day, _special_quantity))
        
        
        # Example output:
        # _special_quantity ----> {'Count': {'L2': 8, 'L6': 7, 'RRR': 2},'Quantity189': {'L2': 1512, 'L6': 1323, 'RRR': 378}}
        
        _detail_data = j2_env.get_template(_detail_list_view).render(detail_day_content_aggr=_detail_aggr[_day],
                                                                     detail_day_content_list=_detail_list[_day],
                                                                     detail_day=_day,
                                                                     special_quantity = _special_quantity
                                                                     )

        if socket.gethostname() != "nb-toth":
            _serve = 'twowings'
            _oname = os.path.join(_path_template, _serve, _detail_filename)
        else:
            _oname = os.path.join(_path_template, _detail_filename)
        with open(_oname, 'w') as f:
            f.write(_detail_data)
        # ************************************************************

        for _r in _allUniqueReg:
            try:
                _filename = str(_r + "-"+ _day + ".html")
                _data = j2_env.get_template(_reg_tamplate).render(particular_day_content_list=_tables_html_list[_day][_r],
                                                                  particular_day_content_aggr=_tables_html_aggr[_day][_r],
                                                                  unique_reg=_allUniqueReg,
                                                                  xday=_day,
                                                                  timeStamp=ts,
                                                                  reg_key=_r)

                # {{ _reg }}-{{ xday }}
                if socket.gethostname() != "nb-toth":
                    _serve = 'twowings'
                    _oname = os.path.join(_path_template, _serve, _filename)
                else:
                    _oname = os.path.join(_path_template, _filename)
                with open(_oname, 'w') as f:
                    f.write(_data)

            except Exception as missing_key:
                #print('Missing key: {}, I am not going to create this file: {}'.format(missing_key, _filename))
                pass


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
        # print('saving to {}'.format(_omain))
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
day_tamplate = "particular_day_navbar.tpl"
reg_template = "particular_day.tpl"
detail_list_view = "detail_list_view.tpl"

main_template = "main.tpl"
sleep_period = 300

if socket.gethostname() != "nb-toth":
    while True:
        try:
            auth_data, url_token, url_list = get_cred()
            token = get_token(auth_data, url_token)
            render = get_data(token, url_list)
            tables, allUniqueDays, dataframe, plain, allUniqueReg, list_view_by_dates = render_tables(render)
            listx, aggrx, udays, detail_aggr, detail_list = process_tables_to_html(tables, allUniqueDays, allUniqueReg, list_view_by_dates)
            create_files_main_dates(listx, aggrx, udays, linux_template, day_tamplate, allUniqueReg)
            create_files_reg(listx, aggrx, udays, linux_template, reg_template, allUniqueReg, detail_aggr, detail_list, detail_list_view, list_view_by_dates)
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
    tables, allUniqueDays, dataframe, plain, allUniqueReg, list_view_by_dates = render_tables(render)
    listx, aggrx, udays, detail_aggr, detail_list = process_tables_to_html(tables, allUniqueDays, allUniqueReg, list_view_by_dates)
    create_files_main_dates(listx, aggrx, udays, path_template, day_tamplate, allUniqueReg)
    create_files_reg(listx, aggrx, udays, path_template, reg_template, allUniqueReg, detail_aggr, detail_list, detail_list_view, list_view_by_dates)
    create_main(path_template, main_template, udays)
    print("Done!")
    

