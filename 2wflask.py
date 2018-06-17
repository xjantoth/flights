from flask import Flask
import json
import time
import auth
import numpy as np
import datetime
import requests
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from pandas.io.json import json_normalize
pd.set_option('display.max_colwidth', -1)

app = Flask(__name__)

# from IPython.core.display import display, HTML
# display(HTML("<style>.container { width:100% !important; }</style>"))


def get_token(_auth_data, _url_token):
    """

    :param _auth_data:
    :param _url_token:
    :return:
    """
    _auth_data = json.dumps(_auth_data)
    response = requests.post(
        _url_token,
        data=_auth_data
    )
    _token = response.json()['data']['user']['data']['auth_token']
    return _token


def get_data(_token, _url_list):
    """

    :param _token:
    :param _url_list:
    :return:
    """
    try:
        _headers = {'Authorization': 'token' + ' ' + _token}
        _r = requests.post(
            _url_list,
            headers=_headers
        )
        return _r.json()
    except Exception as ee:
        print("{}".format(ee))
        return "could not get data :)"


def determine_direction(x):
    """

    :param x:
    :return:
    """
    x = str(x)
    if x == "BTS" or x == "KSC" or x == "SLD" or x == "TAT":
        return str("TAM")
    else:
        return str("SPAT")


def determine_production(x):
    """

    :param x:
    :return:
    """
    x = str(x)
    if x == "BTS":
        return str("BTS")
    elif x == "KSC":
        return str("KSC")
    else:
        return str("---")


def extra_catering(x):
    """

    :param x:
    :return:
    """
    try:
        return ['{0}: {1}'.format(i['code'],i['count']) for i in x]
    except:
        return 0

# This is an example how input list should look like
# i = ['2018-06-14 09:00:00:::2018-06-15 09:00:00',
#      '2018-06-15 09:00:00:::2018-06-16 09:00:00',
#      '2018-06-16 09:00:00:::2018-06-17 09:00:00']


def split_weird_timeframes(_i, _dataframe):
    """

    :param _i:
    :param _dataframe:
    :return:
    """
    _s = _i.split('___')[0]
    _e = _i.split('___')[1]
    return _dataframe.loc[_s:_e]


def render_tables(_data):
    print(_data)
    """

    :param _data:
    :return:
    """
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
    _compare['Extra Catering'] = _df['extra_catering'].map(extra_catering)
    _compare['Note'] = _df['catering_order.general_note'].map(
        lambda x: "{0}{1}{2}".format("""<div class="hoverable">""", str(x), "</div>"))
    _compare['Note'] = _compare['Note'].map(lambda x: str(x).replace('\n', "<br>"))
    _compare['Note'] = _compare['Note'].map(lambda x: str(x).replace('\r', ''))
    _compare['Quantity'] = _compare['Quantity'].fillna(0)
    _compare['Crew'] = _compare['Crew'].fillna(0)
    _compare.index = _compare['Departure']
    _all_unique_days = _df['local_std_date'].unique()
    _all_unique_days = np.sort(_all_unique_days)
    _all_unique_days = ['{0} {1}___{2}-{3}-{4} {1}'.format(str(i), '09:00:00', str(i).split('-')[0], str(i).split('-')[1],
                                                         int(str(i).split('-')[2]) + 1) for i in _all_unique_days]
    # .....................

    _all_unique_reg = _df['aircraft_reg'].unique()
    tables = {}
    _list_view_by_dates = {}
    for i in _all_unique_days:
        temp_table_day_chunck = split_weird_timeframes(i, _compare)
        _list_view_by_dates[i] = temp_table_day_chunck
        temp_storage = {}
        for _reg in _all_unique_reg:
            sorting_particular_day_df = temp_table_day_chunck.sort_values(["Reg", "Depart"], ascending=True)
            try:
                is_dataframe = sorting_particular_day_df.loc[sorting_particular_day_df['Reg'] == _reg]
                if not is_dataframe.empty:
                    temp_storage[_reg] = sorting_particular_day_df.loc[sorting_particular_day_df['Reg'] == _reg]

            except Exception as missing_reg:
                temp_storage[_reg] = "<empty>"

        tables[i] = temp_storage

    return tables, _all_unique_days, _compare, _df, _all_unique_reg, _list_view_by_dates


def process_tables_to_html(_tables, _all_unique_days, _all_unique_reg, _list_view_by_dates):
    """

    :param _tables:
    :param _all_unique_days:
    :param _all_unique_reg:
    :param _list_view_by_dates:
    :return:
    """
    tables_html_aggr = {}
    tables_html_list = {}
    _detail_aggr = {}
    _detail_list = {}

    for k in _all_unique_days:
        # aggregation table - little
        # This is Detail page for each day in the second NAVBAR
        _detail_aggr[k] = _list_view_by_dates[k].groupby(['Meal', 'Direction']).sum().to_html(
            classes="table table-sm table-hover table-striped table-responsive", escape=False)
        _detail_list[k] = _list_view_by_dates[k].sort_values(['Reg', 'Depart'], ascending=[True, True]).drop(
            'Departure', axis=1).to_html(
            classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
            index=False)

        temp_aggr_dict = {}
        temp_list_table_dict = {}
        for _reg in _all_unique_reg:
            try:
                temp_aggr = _tables[k][_reg].groupby(['Meal', 'Direction']).sum()
                temp_aggr_dict[_reg] = temp_aggr.to_html(
                    classes="table table-sm table-hover table-striped table-responsive", escape=False)
            except Exception as aggr_exists_error:
                pass

            try:
                # Remove column
                removed_column = _tables[k][_reg].drop('Departure', axis=1)
                # Remove empty row
                temp_list_table_dict[_reg] = removed_column.to_html(
                    classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
                    index=False)
            except Exception as list_table_error:
                pass

        tables_html_aggr[k] = temp_aggr_dict
        tables_html_list[k] = temp_list_table_dict

    return tables_html_list, tables_html_aggr, _all_unique_days, _detail_aggr, _detail_list


def get_cred():
    """

    :return:
    """
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


# def remove_time(_x, _ind):
#     """
#
#     :param _x:
#     :param _ind:
#     :return:
#     """
#     _t = _x.split('___')[_ind].strip('09_00_00')
#     return _t


def create_main(_path_template,
                _main_tamplate,
                _unique_days):
    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _unique_days_double = [[i.replace(' ', '_').replace(':', '_'), '{} ++'.format(i.split('__')[0].split(' ')[0])] for i in _unique_days]
    # Output: ['2018-06-14_09_00_00___2018-06-15_09_00_00', '2018-06-14 09:00: ++']
    # '2018-06-14 09:00:00___2018-06-15 09:00:00'
    _data = j2_env.get_template(_main_tamplate).render(
        unique_days=_unique_days_double,
        timeStamp=ts)
    return _data, _unique_days_double


def create_files_main_dates(_tables_html_list,
                            _tables_html_aggr,
                            _all_unique_days,
                            _path_template,
                            _day_template,
                            _all_unique_reg,
                            _day):
    """

    :param _tables_html_list:
    :param _tables_html_aggr:
    :param _all_unique_days:
    :param _path_template:
    :param _day_template:
    :param _all_unique_reg:
    :param _day:
    :return:
    """

    # GOAL: '2018-06-14 09:00:00___2018-06-15 09:00:00'
    # CURR: '2018-06-14_09_00_00___2018-06-15_09_00_00'
    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}
    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _ureg = list(_tables_html_list[_day_dict_lookup[_day]].keys())
    # _dayx =str(_day).replace(' ', '_').replace(':', '_')
    _data = j2_env.\
        get_template(_day_template).render(particular_day_content_list=_tables_html_list[_day_dict_lookup[_day]],
                                                      particular_day_content_aggr=_tables_html_aggr[_day_dict_lookup[_day]],
                                                      unique_reg=_ureg,
                                                      xday=_day,
                                                      timeStamp=ts)
    return _data


def create_detail_list(_all_unique_days,
                       _path_template,
                       _detail_aggr,
                       _detail_list,
                       _detail_list_view,
                       _list_view_by_dates,
                       _day):
    """

    :param _all_unique_days:
    :param _path_template:
    :param _detail_aggr:
    :param _detail_list:
    :param _detail_list_view:
    :param _list_view_by_dates:
    :param _day:
    :return:
    """

    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}
    tmpx = pd.DataFrame(_list_view_by_dates[_day_dict_lookup[_day]])
    tmpx = pd.DataFrame(tmpx.groupby(['Meal', 'Direction']).count().iloc[:, 1])
    _special_quantity = {k: [v, int(v) * 189] for k, v in tmpx.to_dict()['Depart'].items()}
    _detail_data = j2_env.get_template(_detail_list_view).render(detail_day_content_aggr=_detail_aggr[_day_dict_lookup[_day]],
                                                                 detail_day_content_list=_detail_list[_day_dict_lookup[_day]],
                                                                 detail_day=_day_dict_lookup[_day],
                                                                 special_quantity=_special_quantity)

    return _detail_data


def create_registration(_tables_html_list,
                        _tables_html_aggr,
                        _all_unique_days,
                        _path_template,
                        _reg_template,
                        _all_unique_reg,
                        _day,
                        _r):
    """

    :param _tables_html_list:
    :param _tables_html_aggr:
    :param _all_unique_days:
    :param _path_template:
    :param _reg_template:
    :param _all_unique_reg:
    :param _day:
    :param _r:
    :return:
    """
    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}
    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    try:
        _data = j2_env.get_template(_reg_template).render(
            particular_day_content_list=_tables_html_list[_day_dict_lookup[_day]][_r],
            particular_day_content_aggr=_tables_html_aggr[_day_dict_lookup[_day]][_r],
            unique_reg=_all_unique_reg,
            timeStamp=ts,
            reg_key=_r)
        return _data
    except Exception as e:
        pass


path_template = "C:\\Users\\jan.toth\\Documents\\2w"
linux_template = "/opt/twowings"
day_tamplate = "particular_day_navbar.tpl"
reg_template = "particular_day.tpl"
detail_list_view = "detail_list_view.tpl"

main_template = "main.tpl"
sleep_period = 300
auth_data, url_token, url_list = get_cred()
token = get_token(auth_data, url_token)


@app.route('/')
def get_main_page():
    render = get_data(token, url_list)
    tables, \
    allUniqueDays, \
    dataframe, \
    plain, \
    allUniqueReg, \
    list_view_by_dates = render_tables(render)

    listx, \
    aggrx, \
    udays, \
    detail_aggr, \
    detail_list = process_tables_to_html(tables,
                                         allUniqueDays,
                                         allUniqueReg,
                                         list_view_by_dates)
    data, udd = create_main(path_template, main_template, udays)
    print(udd)
    return data


@app.route('/day/<_day>')
def particular_main_date(_day):
    render = get_data(token, url_list)
    tables, \
    allUniqueDays, \
    dataframe, \
    plain, \
    allUniqueReg, \
    list_view_by_dates = render_tables(render)

    listx, \
    aggrx, \
    udays, \
    detail_aggr, \
    detail_list = process_tables_to_html(tables,
                                         allUniqueDays,
                                         allUniqueReg,
                                         list_view_by_dates)
    # GOAL: '2018-06-14 09:00:00___2018-06-15 09:00:00'
    # CURR: '2018-06-14_09_00_00___2018-06-15_09_00_00'
    part_data = create_files_main_dates(listx,
                                        aggrx,
                                        udays,
                                        path_template,
                                        day_tamplate,
                                        allUniqueReg,
                                        _day)
    return part_data


@app.route('/detail/<_day>')
def get_detail_list(_day):
    render = get_data(token, url_list)
    tables, \
    allUniqueDays, \
    dataframe, \
    plain, \
    allUniqueReg, \
    list_view_by_dates = render_tables(render)

    listx, \
    aggrx, \
    udays, \
    detail_aggr, \
    detail_list = process_tables_to_html(tables,
                                         allUniqueDays,
                                         allUniqueReg,
                                         list_view_by_dates)
    # GOAL: '2018-06-14 09:00:00___2018-06-15 09:00:00'
    # CURR: '2018-06-14_09_00_00___2018-06-15_09_00_00'

    detail_data = create_detail_list(udays,
                                     path_template,
                                     detail_aggr,
                                     detail_list,
                                     detail_list_view,
                                     list_view_by_dates,
                                     _day)
    return detail_data


@app.route('/reg/<_day>/<_r>')
def get_registration(_day, _r):
    render = get_data(token, url_list)
    tables, allUniqueDays, dataframe, plain, allUniqueReg, list_view_by_dates = render_tables(render)
    listx, aggrx, udays, detail_aggr, detail_list = process_tables_to_html(tables,
                                                                           allUniqueDays,
                                                                           allUniqueReg,
                                                                           list_view_by_dates)
    # GOAL: '2018-06-14 09:00:00___2018-06-15 09:00:00'
    # CURR: '2018-06-14_09_00_00___2018-06-15_09_00_00'
    registration_data = create_registration(listx,
                        aggrx,
                        udays,
                        path_template,
                        reg_template,
                        allUniqueReg,
                        _day,
                        _r)
    return registration_data


if __name__ == '__main__':
    app.run()