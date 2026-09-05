#!/usr/bin/env bash
set -o errexit

echo "==> Starting build process..."

# Find and install requirements
if [ -f requirements.txt ]; then
    echo "==> Installing from ./requirements.txt"
    pip install -r requirements.txt
elif [ -f s2kennel_backend/requirements.txt ]; then
    echo "==> Installing from s2kennel_backend/requirements.txt"
    pip install -r s2kennel_backend/requirements.txt
fi

# Locate manage.py directory
if [ -f manage.py ]; then
    MANAGE_CMD="python manage.py"
elif [ -f s2kennel_backend/manage.py ]; then
    cd s2kennel_backend
    MANAGE_CMD="python manage.py"
elif [ -f backend/manage.py ]; then
    cd backend
    MANAGE_CMD="python manage.py"
else
    echo "Error: manage.py not found!"
    exit 1
fi

echo "==> Collecting static files..."
$MANAGE_CMD collectstatic --no-input

echo "==> Running database migrations..."
$MANAGE_CMD migrate

echo "==> Running seed_data..."
$MANAGE_CMD seed_data

echo "==> Running add_customer_photos..."
$MANAGE_CMD add_customer_photos || true

echo "==> Build process completed successfully!"
