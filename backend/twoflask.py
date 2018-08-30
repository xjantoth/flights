import time
import json
import datetime
import pandas as pd
from flask import Flask, jsonify
from pandas.io.json import json_normalize

from flask_restful import Api
# from flask_jwt import JWT
from flask_jwt_extended import JWTManager, jwt_required

# from security import authenticate, identity
from resources import (UserRegister,
                        User,
                        UserLogin,
                        TokenRefresh,
                        UserLogout)
from models import (FlightData, UserModel)
from blacklist import BLACKLIST


pd.set_option('display.max_colwidth', -1)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True # To allow flask propagating exception even if debug is set to false on app
app.secret_key = 'jose'  # this is flask_jwt related
app.config['JWT_SECRET_KEY'] = 'tanicka' # this is flask_jwt_extended related
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

api = Api(app)
jwt = JWTManager(app) # this is not creating /auth endpoint


@jwt.user_claims_loader
def add_claim_to_jwt(identity):
    if identity == 1:  # Instead of hard-coding, you should read it from config
        return {'is_admin': True}
    return {'is_admin': False}


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token['jti'] in BLACKLIST


@jwt.expired_token_loader
def exipred_token_callback():
    return jsonify(
        {
            'description': 'The token has expired',
            'error': 'token_expired'
        }
    ), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'description': 'Signature verification failed.',
                    'error': 'invalid_token'
                    }
                   ), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'description': 'Request does not contain an access token.',
                    'error': 'authorization_required'
                    }
                   ), 401


@jwt.needs_fresh_token_loader
def token_not_fresh_callback():
    return jsonify({'description': 'The token is not fresh.',
                    'error': 'fresh_token_required'
                    }
                   ), 401


@jwt.revoked_token_loader
def revoked_token_callback():
    return jsonify({'description': 'The token has been revoked.',
                    'error': 'token_revoked'
                    }
                   ), 401


@app.before_first_request
def create_tables():
    from db import db
    with app.app_context():
        db.init_app(app)
        db.create_all()


determine_direction = lambda x: "TAM" if str(x) in ["BTS", "KSC", "SLD", "TAT"] else "SPAT"

determine_production = lambda x: str(x) if str(x) in ["BTS", "KSC"] else "---"


def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = int((te - ts) * 1000)
        else:
            print('{}  {} ms'.format(method.__name__, (te - ts) * 1000))
        return result
    return timed


@timeit
def get_data():
    return FlightData.find_latest()


def extra_catering(x):
    """
    :param x:
    :return:
    """
    try:
        return ['{0}: {1}'.format(i['code'], i['count']) for i in x]
    except:
        return 0


def split_data_at_time(_df, _time, is_last_day):
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
    if 'xUID' not in _df:                                # temporarily create unique index, if does not exists
        _df['xUID'] = range(_df.shape[0])
    a = _df.loc[_time:, :]
    delimiter = a.iloc[:1].index.values[0]
    delimiter = _df[_df.index == delimiter].ix[0].xUID   # get unique index of first occurrence of delimiter
    if is_last_day:    
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
    _converted = json.loads(_data.decode('utf-8'))
    _df = json_normalize(_converted['data']['flight']['data'])
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


@timeit
def render_tables(_df):
    """
    :param _df:
    :return:
    """
    _compare = pd.DataFrame()
    _compare['Departure'] = pd.to_datetime(_df['std_date'] + ' ' + _df['std_time'])
    _compare['Depart'] = _compare['Departure']
    _compare['Arrival'] = pd.to_datetime(_df['sta_date'] + ' ' + _df['sta_time'])
    _compare['Flight'] = _df['flight_number']
    _compare['Aircraft'] = _df['aircraft_config']
    _compare['Reg'] = _df['aircraft_reg']
    _compare['Route'] = _df['route_id']
    _compare["Meal"] = _df["catering_order.flight_meal_type"].fillna('')
    _compare['Direction'] = _df['departure_iata'].map(determine_direction)
    _compare['Production'] = _df['departure_iata'].map(determine_production)
    _compare['From'] = _df['departure_iata']
    _compare['To'] = _df['destination_iata']
    _compare['Quantity'] = _df['catering_order.quantity_y']
    _compare['Crew'] = _df['catering_order.quantity_crew'].fillna('')
    _compare['Extra Catering'] = _df['extra_catering'].map(extra_catering)
    _compare['Note'] = _df['catering_order.general_note'].fillna('')
    _compare['Quantity'] = _compare['Quantity'].fillna(0)
    _compare['Crew'] = _compare['Crew'].fillna(0)
    _compare.index = _compare['Departure']
    _compare = _compare.sort_values(['Depart'], ascending=[True])
    return _compare


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
def create_detail_list_json(_compare,
                            _all_unique_days,
                            _day):
    """
    :param _compare:
    :param _all_unique_days:
    :param _day:
    :return:
    """
    list_view = select_scoped_timeframe(_compare, _all_unique_days, _day)
    tmpx = list_view
    tmpx = tmpx.groupby(['Meal', 'Direction']).count().iloc[:, 1]
    u = list(set([i[0] for i in list(set(tmpx.to_dict().keys()))]))
    default_quantity = {i: {'TAM': '', 'SPAT': ''} for i in u}
    for i in list(set(tmpx.to_dict().keys())):
        default_quantity[i[0]][i[1]] = '{}/{}'.format(tmpx.to_dict()[i], int(tmpx.to_dict()[i]) * 189)
    _special_quantity = {'   '.join(k): [v, int(v) * 189] for k, v in pd.DataFrame(tmpx).to_dict()['Depart'].items()}
    a_view = list_view.groupby(['Meal', 'Direction']).sum().to_dict(orient="records")
    l_view = list_view.sort_values(['Route', 'Depart'], ascending=[True, True]).drop(['Departure'], axis=1).to_dict(orient="records")
    return {"special_quantity": _special_quantity, "aggregated": a_view, "list_view": l_view, "default_quantity": default_quantity}


@timeit
def create_registration_json(_compare,
                             _all_unique_days,
                             _day,
                             _r):
    """
    :param _compare:
    :param _all_unique_days:
    :param _day:
    :param _r:
    :return:
    """
    route_view = select_scoped_timeframe(_compare, _all_unique_days, _day)
    _u_route = list(_compare['Route'].unique())
    route_view = route_view.loc[route_view['Route'] == _r]
    route_view_agg = route_view.groupby(['Meal', 'Direction']).sum().to_dict(orient="records")
    route_view_list = route_view.sort_values(['Route', 'Depart'], ascending=[True, True]).drop(
        ['Departure'], axis=1).to_dict(orient="records")
    return {"unique_routes": _u_route,
            "route_view_agg": route_view_agg,
            "route_view_list": route_view_list}


@app.route('/api/allud')
@jwt_required
def get_all_unique_days_json():
    data = get_data()
    if not data:
        return '', 404
    _allud, _df_normalized = get_unique_days(data.json_data)
    return jsonify({'data': _allud, 'updated': data.created})


@app.route('/api/alludx')
@jwt_required
def get_all_unique_days_jsonx():
    data = get_data()
    if not data:
        return '', 404
    _allud, _df_normalized = get_unique_days(data.json_data)
    _allud = [i.replace(' ', '_').replace(':', '_') for i in _allud]
    return jsonify({"data": _allud, "updated": data.created})


@app.route('/api/detail/<_day>')
@jwt_required
def get_detail_list_json(_day):
    data = get_data()
    if not data:
        return '', 404
    udays, df_normalized = get_unique_days(data.json_data)
    compare = render_tables(df_normalized)
    detail_data_json = create_detail_list_json(compare,
                                               udays,
                                               _day)
    return jsonify({'data': detail_data_json, 'updated': data.created})


@app.route('/api/reg/<_day>/<_r>')
@jwt_required
def get_registration_json(_day, _r):
    data = get_data()
    if not data:
        return '', 404
    udays, df_normalized = get_unique_days(data.json_data)
    compare = render_tables(df_normalized)
    reg_data = create_registration_json(
        compare,
        udays,
        _day,
        _r)
    return jsonify({'data': reg_data, 'updated': data.created})


api.add_resource(UserRegister, '/api/register')
api.add_resource(User, '/api/user/<int:user_id>')
api.add_resource(UserLogin, '/api/login')
api.add_resource(TokenRefresh, '/api/refresh')
api.add_resource(UserLogout, '/api/logout')


if __name__ == '__main__':
    from db import db
    db.init_app(app)
    app.run(host='0.0.0.0', debug=True)
