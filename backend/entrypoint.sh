#!/bin/sh
set -e

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

# Seed demo data on first boot (safe: uses get_or_create).
if [ "${SEED_ON_START:-false}" = "true" ]; then
  echo "Seeding demo data..."
  python manage.py seed || true
fi

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
