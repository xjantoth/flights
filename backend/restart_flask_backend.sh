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
  PIDE=$(lsof -n -i :${PORT} | grep LISTEN | head -n 1 | awk -F" " '{print $2}')
  PROCESSE=$(lsof -n -i :${PORT} | grep LISTEN | head -n 1)
  if [ -f ${PID_FILENAME}.pid ]; then
    kill -9 `cat ${PID_FILENAME}.pid`
    sleep 10
  elif [ ! -z ${PIDE} ]; then
    echo "${PID_FILENAME}.pid does not exist"
    echo "Found this process: ${PROCESSE}"
    echo "Killing pid: ${PIDE}"
    kill -9 ${PIDE}
  else
    echo 'Process on port :${PORT} is probably not running. No action needed.'
  fi

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



