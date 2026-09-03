#!/usr/bin/env bash
set -o errexit

if [ -f requirements.txt ]; then
    pip install -r requirements.txt
elif [ -f backend/requirements.txt ]; then
    pip install -r backend/requirements.txt
fi

if [ -f manage.py ]; then
    python manage.py collectstatic --no-input
    python manage.py migrate
    python manage.py seed_data
elif [ -f backend/manage.py ]; then
    python backend/manage.py collectstatic --no-input
    python backend/manage.py migrate
    python backend/manage.py seed_data
fi