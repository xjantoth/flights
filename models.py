import pytz
import datetime
from db import db


class FlightData(db.Model):
    __tablename__ = 'flight_data'

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.datetime.now(pytz.timezone("Europe/Bratislava")))
    json_data = db.Column(db.String())

    def __init__(self, data, created):
        self.json_data = data
        self.created = created

    def json(self):
        return self.json_data

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_latest(cls):
        return cls.query.order_by(cls.created.desc()).first()