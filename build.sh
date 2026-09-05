#!/usr/bin/env bash
set -o errexit

if [ -f requirements.txt ]; then
    pip install -r requirements.txt
fi

if [ -f s2kennel_backend/requirements.txt ]; then
    pip install -r s2kennel_backend/requirements.txt
fi

if [ -f s2kennel_backend/build.sh ]; then
    bash s2kennel_backend/build.sh
fi

if [ -f manage.py ]; then
    python manage.py collectstatic --no-input
    python manage.py migrate
    python manage.py seed_data
    python manage.py add_customer_photos
fi
