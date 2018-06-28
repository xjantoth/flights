import os
from flask import Flask
import json
import time
import auth
import pytz
import socket
import numpy as np
import datetime
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from pandas.io.json import json_normalize
from flask_sqlalchemy import SQLAlchemy
pd.set_option('display.max_colwidth', -1)


project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "2w.sqlite"))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_file
db = SQLAlchemy(app)


class FlightData(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.datetime.now(pytz.timezone("Europe/Bratislava")))
    json_data = db.Column(db.String())

    def __init__(self, json_data):
        self.json_data = json_data


def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = int((te - ts) * 1000)
        else:
            print('%r  %2.2f ms' % \
                  (method.__name__, (te - ts) * 1000))
        return result
    return timed


@timeit
def get_data():
    try:
        raw_data = FlightData.query.order_by(FlightData.created.desc()).first_or_404().json_data
        raw_data = json.loads(raw_data.decode('utf-8'))
        created_date = FlightData.query.order_by(FlightData.created.desc()).first_or_404().created
        return raw_data, created_date

    except Exception as ee:
        print("{}".format(ee))
        return None


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


def split_weird_timeframes(_i, _dataframe):
    """

    :param _i:
    :param _dataframe:
    :return:
    """
    _s = _i.split('___')[0]
    _e = _i.split('___')[1]
    return _dataframe.loc[_s:_e]


def add_one_day(_ii):
    _plus_day = datetime.datetime.strptime(_ii, '%Y-%m-%d %H:%M:%S') + datetime.timedelta(1)
    return _plus_day


@timeit
def get_unique_days(_data):
    """

    :param _data:
    :return:
    """
    _df = json_normalize(_data['data']['flight']['data'])
    _df_normalized = _df
    _all_unique_days = _df['local_std_date'].unique()
    _all_unique_days = np.sort(_all_unique_days)
    _all_unique_days = ['{}___{}'.format(_i + ' 09:00:00', add_one_day(_i + ' 09:00:00')) for _i in _all_unique_days]
    return _all_unique_days, _df_normalized


@timeit
def render_tables(_df_normalized):
    """

    :param _df_normalized:
    :return:
    """
    _df = _df_normalized
    _compare = pd.DataFrame()

    _compare['Departure'] = pd.to_datetime(_df['local_std_date'] + ' ' + _df['local_std_time'])
    _compare['Depart'] = _compare['Departure']
    _compare['Arrival'] = pd.to_datetime(_df['local_sta_date'] + ' ' + _df['local_sta_time'])
    _compare['Flight'] = _df['flight_number']
    _compare['Aircraft'] = _df['aircraft_config']
    _compare['Reg'] = _df['aircraft_reg']
    _compare['Route'] = _df['route_id']
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
    return _compare


@timeit
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


@timeit
def create_main(_path_template,
                _main_tamplate,
                _unique_days,
                _ts):
    """

    :param _path_template:
    :param _main_tamplate:
    :param _unique_days:
    :param _ts:
    :return:
    """
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _unique_days_double = [[i.replace(' ', '_').replace(':', '_'), '{} ++'.format(i.split('__')[0].split(' ')[0])] for i in _unique_days]
    _data = j2_env.get_template(_main_tamplate).render(
        unique_days=_unique_days_double,
        timeStamp=_ts)
    return _data, _unique_days_double


@timeit
def create_files_main_dates(_compare,
                            _all_unique_days,
                            _path_template,
                            _day_template,
                            _day):
    """

    :param _compare:
    :param _all_unique_days:
    :param _path_template:
    :param _day_template:
    :param _day:
    :return:
    """
    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}
    temp_table_day_chunck = split_weird_timeframes(_day_dict_lookup[_day], _compare)

    _agg_table = temp_table_day_chunck.groupby(['Meal', 'Direction']).sum().to_html(
            classes="table table-sm table-hover table-striped table-responsive", escape=False)
    _detail_table = temp_table_day_chunck.sort_values(['Route', 'Depart'], ascending=[True, True]).drop(
            'Departure', axis=1).to_html(
            classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
            index=False)

    _u_route = temp_table_day_chunck['Route'].unique()

    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    j2_env = Environment(loader=FileSystemLoader(_path_template))

    try:
        _data = j2_env.\
            get_template(_day_template).render(particular_day_content_list=_detail_table,
                                               particular_day_content_aggr=_agg_table,
                                               unique_reg=_u_route,
                                               xday=_day,
                                               timeStamp=ts)
        return _data
    except Exception as cfmd:
        print('create_files_main_dates: {}'.format(cfmd))
        return "no_data"


@timeit
def create_detail_list(_compare,
                       _all_unique_days,
                       _path_template,
                       _detail_list_view_tpl,
                       _day):
    """

    :param _compare:
    :param _all_unique_days:
    :param _path_template:
    :param _detail_list_view_tpl:
    :param _day:
    :return:
    """

    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}

    list_view = split_weird_timeframes(_day_dict_lookup[_day], _compare)

    tmpx = list_view
    tmpx = tmpx.groupby(['Meal', 'Direction']).count().iloc[:, 1]
    print(tmpx)

    # _special_quantity = {k: [v, int(v) * 189] for k, v in tmpx.to_dict()['Depart'].items()}
    _detail_data = j2_env.get_template(_detail_list_view_tpl).render(detail_day_content_aggr=list_view.groupby(['Meal', 'Direction']).sum().to_html(
            classes="table table-sm table-hover table-striped table-responsive", escape=False),
                                                                 detail_day_content_list=list_view.sort_values(['Route', 'Depart'], ascending=[True, True]).drop('Departure', axis=1).to_html(
            classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
            index=False),
                                                                 detail_day=_day_dict_lookup[_day],
                                                                 special_quantity="_")

    return _detail_data


@timeit
def create_registration(_compare,
                        _all_unique_days,
                        _path_template,
                        _reg_template,
                        _day,
                        _r):
    """

    :param _compare:
    :param _all_unique_days:
    :param _path_template:
    :param _reg_template:
    :param _day:
    :param _r:
    :return:
    """

    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}
    route_view = split_weird_timeframes(_day_dict_lookup[_day], _compare)
    _u_route = _compare['Route'].unique()
    route_view = route_view.loc[route_view['Route'] == _r]

    route_view_agg = route_view.groupby(['Meal', 'Direction']).sum().to_html(
        classes="table table-sm table-hover table-striped table-responsive", escape=False)
    route_view_list = route_view.sort_values(['Route', 'Depart'], ascending=[True, True]).drop(
        'Departure', axis=1).to_html(
        classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
        index=False)

    ts = "Last update on: {} time: {}".format(datetime.date.today().strftime("%d/%B/%Y"), time.strftime("%H:%M:%S"))
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    try:
        _data = j2_env.get_template(_reg_template).render(
            particular_day_content_list=route_view_list,
            particular_day_content_aggr=route_view_agg,
            unique_reg=_u_route,
            timeStamp=ts,
            reg_key=_r)
        return _data
    except Exception as e:
        pass


win_template = auth.login["win_template"]
linux_template = auth.login["linux_template"]
day_tamplate = auth.login["day_tamplate"]
reg_template = auth.login["reg_template"]
detail_list_view_tpl = auth.login["detail_list_view_tpl"]
jumbo_tpl = auth.login["jumbo_tpl"]
main_template = auth.login["main_template"]


path_template = win_template
if socket.gethostname() != "nb-toth":
    path_template = linux_template


@app.route('/jumbo')
def get_jumbo():
    j2_env = Environment(loader=FileSystemLoader(path_template))
    _data = j2_env.get_template(jumbo_tpl).render()
    return _data


@app.route('/')
def get_main_page():
    render, created_datetime = get_data()
    udays, df_normalized = get_unique_days(render)
    data, udd = create_main(path_template, main_template, udays, created_datetime)
    return data


@app.route('/day/<_day>')
def particular_main_date(_day):
    render, created_datetime = get_data()
    udays, df_normalized = get_unique_days(render)
    compare = render_tables(df_normalized)
    part_data = create_files_main_dates(compare,
                                        udays,
                                        path_template,
                                        day_tamplate,
                                        _day)
    return part_data


@app.route('/detail/<_day>')
def get_detail_list(_day):
    render, created_datetime = get_data()
    udays, df_normalized = get_unique_days(render)
    compare = render_tables(df_normalized)
    # GOAL: '2018-06-14 09:00:00___2018-06-15 09:00:00'
    # CURR: '2018-06-14_09_00_00___2018-06-15_09_00_00'
    detail_data = create_detail_list(compare,
                                     udays,
                                     path_template,
                                     detail_list_view_tpl,
                                     _day)
    return detail_data


@app.route('/reg/<_day>/<_r>')
def get_registration(_day, _r):
    render, created_datetime = get_data()
    udays, df_normalized = get_unique_days(render)
    compare = render_tables(df_normalized)
    # GOAL: '2018-06-14 09:00:00___2018-06-15 09:00:00'
    # CURR: '2018-06-14_09_00_00___2018-06-15_09_00_00'
    registration_data = create_registration(
        compare,
        udays,
        path_template,
        reg_template,
        _day,
        _r)
    return registration_data


if __name__ == '__main__':
    app.run(host='0.0.0.0')