import os
import time
import auth
import json
import requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "2w.sqlite"))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_file
db = SQLAlchemy(app)


class FlightData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, server_default=db.func.now())
    json_data = db.Column(db.String())

    def __init__(self, json_data):
        self.json_data = json_data


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
    _headers = {'Authorization': 'token' + ' ' + _token}
    start = time.clock()
    try:
        _r = requests.post(
            _url_list,
            headers=_headers
        )
        request_time = time.clock() - start
        print("Request completed in {0:.0f}ms".format(request_time))
        # print(_r.content)
        return _r.content, request_time
    except Exception as ee:
        print('Could not get data: {}'.format(ee))
        return None


def add_to_flight_data(_data):
    """
    
    :param _data:
    :return:
    """
    if _data:
        try:
            new_record = FlightData(json_data=_data)
            db.session.add(new_record)
            db.session.commit()
            # print('Data instertedto DB!')
            return "Success"
        except Exception as e:
            # print('Data NOT instertedto DB! {}'.format(e))
            pass


auth_data, url_token, url_list = get_cred()
token = get_token(auth_data, url_token)
data, duration = get_data(token, url_list)
add_to_flight_data(data)
