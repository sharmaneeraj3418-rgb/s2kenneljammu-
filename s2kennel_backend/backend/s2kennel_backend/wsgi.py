"""
WSGI config for s2kennel_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os

from django.core.wsgi import get_wsgi_application

if os.environ.get('DJANGO_SETTINGS_MODULE') is None:
    if os.path.exists('backend/s2kennel_backend/settings.py'):
        os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.s2kennel_backend.settings'
    else:
        os.environ['DJANGO_SETTINGS_MODULE'] = 's2kennel_backend.settings'

application = get_wsgi_application()