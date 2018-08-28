from flask_jwt_extended import (create_access_token,
                                create_refresh_token,
                                jwt_refresh_token_required,
                                get_jwt_identity,
                                jwt_required,
                                get_raw_jwt)
from flask_restful import Resource, reqparse
from models import UserModel
from werkzeug.security import safe_str_cmp
from blacklist import BLACKLIST
import datetime


_parser = reqparse.RequestParser()
_parser.add_argument(
    'username',
    type=str,
    required=True,
    help='This User field can not be blank'
)
_parser.add_argument(
    'password',
    type=str,
    required=True,
    help="This Password field can not be blank!"
)


class UserRegister(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _parser.parse_args()
        if UserModel.find_by_username(data['username']):
            return {"message": "A user with the username: {} already exists!".format(data['username'])}, 400

        user = UserModel(**data)
        user.save_to_db()

        return {"message": "User created successfully."}, 201


class User(Resource):
    @classmethod
    @jwt_required
    def get(cls, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"message": "User not found!"}
        return user.json()

    @classmethod
    @jwt_required
    def delete(cls, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"message": "User not found!"}, 404
        user.delete_from_db()
        return {"message": "User deleted"}, 200


class UserLogin(Resource):
    @classmethod
    def post(cls):
        data = _parser.parse_args()
        user = UserModel.find_by_username(data['username'])

        # this is what `authenticate` function used to do
        if user and safe_str_cmp(user.password, data['password']):
            # this is what `identity` function used to do
            access_expires = datetime.timedelta(hours=1)
            refresh_expires = datetime.timedelta(hours=12)
            access_token = create_access_token(identity=user.id, fresh=True, expires_delta=access_expires)
            refresh_token = create_refresh_token(identity=user.id, expires_delta=refresh_expires)

            return {
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 200, {'Authorization': 'Bearer {}'.format(access_token)}
        return {'message': 'Invalid credentials!'}, 401


class UserLogout(Resource):
    @jwt_required
    def post(self):
        # this is a unique identifier for JWT TOKEN
        jti = get_raw_jwt()['jti']
        BLACKLIST.add(jti)
        return {'message': 'Successfully logged out!'}, 200


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user,
                                        fresh=False)
        return {'access_token': new_token}, 200




