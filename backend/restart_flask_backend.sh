#!/usr/bin/env bash

set -e

function stop_flask {
  cd ${DEPLOY_PATH_BACKEND}
  kill -9 ${PID_FILENAME}.pid
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