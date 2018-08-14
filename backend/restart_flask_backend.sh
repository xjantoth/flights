#!/usr/bin/env bash

set -e

DEPLOY_PATH_BACKEND="/opt/serve/backend"
PID_FILENAME="2w_app"
BASE_PATH="/opt/serve"
VIRTUALENV_NAME="venv35"
HOST="127.0.0.1"
PORT="4000"
WORKERS_NUMBER="3"
ERROR_LOG_FILENAME="gunicorn_error_lofile"

function stop_flask {
  cd ${DEPLOY_PATH_BACKEND}
  pwd
  kill -9 `cat ${PID_FILENAME}.pid`
  sleep 10
}

function start_flask {
    cd ${DEPLOY_PATH_BACKEND}
    ${BASE_PATH}/${VIRTUALENV_NAME}/bin/python \
    $BASE_PATH/$VIRTUALENV_NAME/bin/gunicorn --bind ${HOST}:${PORT} \
                                             --workers=${WORKERS_NUMBER} \
                                             wsgi:app \
                                             -p ${PID_FILENAME}.pid \
                                             -D \
                                             --error-logfile ${ERROR_LOG_FILENAME}.log
}

stop_flask
start_flask



