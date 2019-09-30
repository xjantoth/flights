import time
import auth
import pytz
import sqlite3
import json
import requests
import datetime
from twoflask import app
from db import db
import  models 

def get_cred():
    _password = auth.login['password']
    _username = auth.login['username']
    _url_token = auth.login['url_token']
    _url_list = auth.login['url_list']
    _auth_data = {
        'auth_company': 'TVS',
        'auth_username': _username,
        'auth_password': _password
    }
    return _auth_data, _url_token, _url_list


def get_token(_auth_data, _url_token):
    """
    :param _auth_data:
    :param _url_token:
    :return:
    """
    _auth_data = json.dumps(_auth_data)
    _response = requests.post(
        _url_token,
        data=_auth_data
    )
    _token = _response.json()['data']['user']['data']['auth_token']
    #print(_response.json()['data']['user']['data'])
    return _token


def get_data(_token, _url_list):
    """

    :param _token:
    :param _url_list:
    :return:
    """
    _headers = {'Authorization': 'token' + ' ' + _token}
    start = time.clock()
    try:
        _r = requests.post(
            _url_list,
            headers=_headers
        )
        request_time = time.clock() - start
        print("Request completed in {0:.0f}ms".format(request_time))
        return _r.content, request_time
    except Exception as ee:
        print('Could not get data: {}'.format(ee))
        return None


# def add_to_flight_data(_data, _db):
#     _time = datetime.datetime.now(pytz.timezone("Europe/Bratislava"))
#     try:
#         if 'Unauthenticated' not in _data.decode('utf-8') and _data is not None:
#             connection = sqlite3.connect(_db)
#             cursor = connection.cursor()
#             query = "INSERT INTO flight_data VALUES (NULL, ?, ?);"
#             cursor.execute(query, (_time, _data ,))
#             connection.commit()
#             connection.close()
#             print('{} - Data inserted to SQLITE!'.format(_time))
#         else:
#             print('{} - Could not insert data to SQLITE!'.format(_time))
#     except Exception as e:
#         print('{} - Panic: Could not insert data to SQLITE! Ended up with error: {}'.format(_time, e))
#         pass

def add_to_flight_data(_data):
    _time = datetime.datetime.now(pytz.timezone("Europe/Bratislava"))
    try:
        if 'Unauthenticated' not in _data.decode('utf-8') and _data is not None:
            with app.app_context():
                db.init_app(app)
                fd = models.FlightData(_data, _time)
                fd.save_to_db()

            print('{} - Data inserted to SQLITE!'.format(_time))
        else:
            print('{} - Could not insert data to SQLITE!'.format(_time))
    except Exception as e:
        print('{} - Panic: Could not insert data to SQLITE!'.format(e))
        pass


auth_data, url_token, url_list = get_cred()
token = get_token(auth_data, url_token)
data, duration = get_data(token, url_list)
add_to_flight_data(data)
