import os
import pytz
from flask import Flask
import datetime
from flask_sqlalchemy import SQLAlchemy

os.chdir("/opt")
database_file = "sqlite:///{}".format("2w.sqlite")
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_file
db = SQLAlchemy(app)


class FlightData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.datetime.now(pytz.timezone("Europe/Bratislava")))
    json_data = db.Column(db.String())

    def __init__(self, json_data):
        self.json_data = json_data


# Create database :)
db.create_all()




