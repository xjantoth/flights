#!/usr/bin/env bash

cd /code

# Prepare log files and start outputting logs to stdout
touch ./gunicorn.log
touch ./gunicorn-access.log
touch ./gunicorn_error_lofile.log
tail -n 0 -f ./gunicorn*.log &

exec gunicorn wsgi:app \
    --bind 0.0.0.0:4000 \
    --workers 3 \
    --pid 2w_app.pid \
    --log-level=info \
    --log-file=./gunicorn.log \
    --error-logfile gunicorn_error_lofile.log \
    --access-logfile=./gunicorn-access.log &

exec "$@"


