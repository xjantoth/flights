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


def split_data_at_time(_df, _time, is_last_day):
    if 'xUID' not in _df:                                # temporarily create unique index, if does not exists
        _df['xUID'] = range(_df.shape[0])

    """
    _df(data frame) we want to split 
     --------
    |        |
    |        |
    |    b   |
    |        |       
    |        | 
     --------    <-- delimiter       _time: 2018-08-04 09:00:00 (for example)
    |    a   |
     --------
    """
    a = _df.loc[_time:, :]
    delimiter = a.iloc[:1].index.values[0]
    delimiter = _df[_df.index == delimiter].ix[0].xUID   # get unique index of first occurrence of delimiter
    if is_last_day:
        """
        This function is called 2x because we always 
        have START and END (from: 2018-08-04 09:00:00 to: 2018-08-04 22:20:00)
        in this interval!
        
        if case we are processing the last interval
        let's say we have these intervals:      2018-08-01 +
                                                2018-08-02 +
                                                2018-08-03 +
                                                2018-08-04 +
        
        the last one would be:                  2018-08-04 +
         
        that means it would be this interval:   2018-08-04 09:00:00 to 2018-08-04 22:20:00
        when we call this function 2nd time we want to make "delimiter" a part of 
        "b-slice" from the image above.
        
        that's why we use "if-else statement" and b = _df[_df['xUID'] <= delimiter]
        """

        b = _df[_df['xUID'] <= delimiter]
    else:
        b = _df[_df['xUID'] < delimiter]
    del _df['xUID']                                      # drop index since it's not needed anymore
    return a, b, delimiter


def get_unique_routes(_df):
    return set(_df['Route'].unique().tolist())


@timeit
def get_unique_days(_data):
    """
    :param _data:
    :return:
    """
    # _raw_data = json.loads((_data[0][0]).decode("utf-8"))
    # _raw_data = json_normalize(_data['data']['flight']['data'])
    _df = json_normalize(_data['data']['flight']['data'])
    grouped = _df.groupby(['std_date'])
    _all_unique_days = []
    for day, group in grouped:
        minimum = group['std_time'].min()
        maximum = group['std_time'].max()
        _all_unique_days.append((day, minimum, maximum))

    start, end = _all_unique_days[::len(_all_unique_days) - 1]
    start = list(start[:2])
    end = list(end[::len(end) - 1])
    start = datetime.datetime.strptime(start[0] + ' ' + start[1], '%Y-%m-%d %H:%M:%S')
    end = datetime.datetime.strptime(end[0] + ' ' + end[1], '%Y-%m-%d %H:%M:%S')
    final = []
    a = start
    while True:
        b = (a + datetime.timedelta(1)).replace(hour=9, minute=0)
        if b > end:
            b = end
            final.append('{}___{}'.format(str(a), str(b)))
            break
        final.append('{}___{}'.format(str(a), str(b)))
        a = b
    return final, _df


colors = ["#000000","#FFFF00","#1CE6FF","#FF34FF","#FF4A46","#008941","#006FA6","#A30059","#FFDBE5","#7A4900",
          "#0000A6","#63FFAC","#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400",
          "#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9",
          "#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F",
          "#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062",
          "#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0",
          "#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9",
          "#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00",
          "#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F",
          "#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3",
          "#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489",
          "#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51",
          "#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01",
          "#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A",
          "#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75",
          "#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4",
          "#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058",
          "#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406",
          "#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE",
          "#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868",
          "#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3",
          "#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03",
          "#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213",
          "#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F",
          "#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71",
          "#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C",
          "#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B"]


@timeit
def render_tables(_df_normalized):
    """

    :param _df_normalized:
    :return:
    """
    _df = _df_normalized
    _compare = pd.DataFrame()
    unique = _df['route_id'].unique().tolist()
    color_map = {str(u): c for u, c in zip(unique, colors)}

    _compare['Departure'] = pd.to_datetime(_df['std_date'] + ' ' + _df['std_time'])
    # _compare['Departure'] = pd.to_datetime(_df['local_std_date'] + ' ' + _df['local_std_time'])
    _compare['Depart'] = _compare['Departure']
    _compare[''] = _df['route_id'].map(
        lambda x: '<span style="border-left: 12px solid {0};"></span>'.format(color_map[str(x)]))
    _compare['Arrival'] = pd.to_datetime(_df['sta_date'] + ' ' + _df['sta_time'])
    _compare['Flight'] = _df['flight_number']
    _compare['Aircraft'] = _df['aircraft_config']
    _compare['Reg'] = _df['aircraft_reg']
    _compare['Route'] = _df['route_id']
    _compare["Meal"] = _df["catering_order.flight_meal_type"]
    _compare['Direction'] = _df['departure_iata'].map(determine_direction)
    _compare['Production'] = _df['departure_iata'].map(determine_production)
    _compare['From'] = _df['departure_iata']
    _compare['To'] = _df['destination_iata']
    # _compare['Depart UTC'] = pd.to_datetime(_df['std_date'] + ' ' + _df['std_time'])
    # _compare['Arr UTC'] = pd.to_datetime(_df['sta_date'] + ' ' + _df['sta_time'])
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
    _compare = _compare.sort_values(['Depart'], ascending=[True])
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


def select_scoped_timeframe(_compare, _all_unique_days, _day):
    _day_dict_lookup = {i.replace(' ', '_').replace(':', '_'): i for i in _all_unique_days}
    DAY = _day_dict_lookup[_day]
    FT, ST = DAY.split('___')

    is_last_day = False
    valid, invalid, dm1 = split_data_at_time(_compare, FT, is_last_day)

    is_last_day = DAY == _all_unique_days[-1]

    extra, main, dm2 = split_data_at_time(valid, ST, is_last_day)
    valid_rids = get_unique_routes(valid)
    invalid_rids = get_unique_routes(invalid)
    intersection = invalid_rids & valid_rids
    main_rids = get_unique_routes(main)
    main_rids = main_rids - intersection
    final = valid[valid['Route'].isin(list(main_rids))]
    return final


@timeit
def create_main(_path_template,
                _main_tamplate,
                _unique_days):
    """

    :param _path_template:
    :param _main_tamplate:
    :param _unique_days:
    :return:
    """
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _unique_days_double = [[i.replace(' ', '_').replace(':', '_'), '{} +'.format(i.split('__')[0].split(' ')[0])] for i in _unique_days]
    _data = j2_env.get_template(_main_tamplate).render(
        unique_days=_unique_days_double,
        timeStamp="")
    return _data, _unique_days_double


@timeit
def create_files_main_dates(_compare,
                            _all_unique_days,
                            _path_template,
                            _day_template,
                            _day,
                            _ts):
    """

    :param _compare:
    :param _all_unique_days:
    :param _path_template:
    :param _day_template:
    :param _day:
    :param _ts:
    :return:
    """

    temp_table_day_chunk = select_scoped_timeframe(_compare, _all_unique_days, _day)
    _agg_table = temp_table_day_chunk.groupby(['Meal', 'Direction']).sum().to_html(
            classes="table table-sm table-hover table-striped table-responsive", escape=False)
    _detail_table = temp_table_day_chunk.sort_values(['Route', 'Depart'], ascending=[True, True]).drop(
            'Departure', axis=1).to_html(
            classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
            index=False)
    _u_route = temp_table_day_chunk['Route'].unique()
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    _data = j2_env.get_template(_day_template).render(particular_day_content_list=_detail_table,
                                                      particular_day_content_aggr=_agg_table,
                                                      unique_reg=_u_route,
                                                      xday=_day,
                                                      timeStamp=_ts)
    return _data


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
    list_view = select_scoped_timeframe(_compare, _all_unique_days, _day)
    print('list_view: {}'.format(list_view.shape[0]))
    tmpx = list_view
    tmpx = tmpx.groupby(['Meal', 'Direction']).count().iloc[:, 1]
    _special_quantity = {'   '.join(k): [v, int(v) * 189] for k, v in pd.DataFrame(tmpx).to_dict()['Depart'].items()}
    a_view = list_view.groupby(['Meal', 'Direction']).sum().to_html(
        classes="table table-sm table-hover table-striped table-responsive",
        escape=False)
    l_view = list_view.sort_values(['Route', 'Depart'], ascending=[True, True]).drop('Departure', axis=1).to_html(
            classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
            index=False)
    print('_compare: {}'.format(_compare.shape[0]))

    _detail_data = j2_env.get_template(_detail_list_view_tpl).render(
        detail_day_content_aggr=a_view,
        detail_day_content_list=l_view,
        detail_day=_day_dict_lookup[_day],
        special_quantity=_special_quantity)

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

    route_view = select_scoped_timeframe(_compare, _all_unique_days, _day)
    _u_route = _compare['Route'].unique()
    route_view = route_view.loc[route_view['Route'] == _r]
    route_view_agg = route_view.groupby(['Meal', 'Direction']).sum().to_html(
        classes="table table-sm table-hover table-striped table-responsive",
        escape=False)
    route_view_list = route_view.sort_values(['Route', 'Depart'], ascending=[True, True]).drop(
        'Departure', axis=1).to_html(
        classes="table table-sm table-hover table-striped table-responsive-xl first-bold", escape=False,
        index=False)
    j2_env = Environment(loader=FileSystemLoader(_path_template))
    try:
        _data = j2_env.get_template(_reg_template).render(
            particular_day_content_list=route_view_list,
            particular_day_content_aggr=route_view_agg,
            unique_reg=_u_route,
            timeStamp="",
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
if socket.gethostname() != "nb-jantoth":
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
    data, udd = create_main(path_template, main_template, udays)
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
                                        _day,
                                        created_datetime)
    return part_data


@app.route('/detail/<_day>')
def get_detail_list(_day):
    render, created_datetime = get_data()
    udays, df_normalized = get_unique_days(render)
    compare = render_tables(df_normalized)
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
