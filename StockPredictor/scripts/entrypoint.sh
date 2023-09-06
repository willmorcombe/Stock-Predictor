#!/bin/sh

set -e

python3 manage.py collectstatic --noinput

cron -f

uwsgi --socket :8000 --master --enable-threads --module StockPredictor.wsgi
