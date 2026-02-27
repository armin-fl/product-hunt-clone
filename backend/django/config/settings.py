from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.environ.get('DJANGO_DEBUG', 'false').lower() in {'1', 'true', 'yes'}

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "dev-secret-key"  # Dev-only fallback; never ship a known SECRET_KEY to production.
    else:
        raise RuntimeError(
            "DJANGO_SECRET_KEY must be set when DJANGO_DEBUG is false (a predictable SECRET_KEY enables cookie/signature forgery)."
        )

raw_hosts = os.environ.get('DJANGO_ALLOWED_HOSTS', '')
ALLOWED_HOSTS = [host.strip() for host in raw_hosts.split(',') if host.strip()]
if not ALLOWED_HOSTS and DEBUG:
    ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'accounts',
    'blog',
    'products',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', os.environ.get('DB_NAME', 'ph_app')),
        'USER': os.environ.get('POSTGRES_USER', os.environ.get('DB_USER', 'ph_user')),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', os.environ.get('DB_PASSWORD', 'ph_password')),
        'HOST': os.environ.get('POSTGRES_HOST', os.environ.get('DB_HOST', 'localhost')),
        'PORT': os.environ.get('POSTGRES_PORT', os.environ.get('DB_PORT', '5432')),
        'CONN_MAX_AGE': 60,
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'login': os.environ.get('DJANGO_AUTH_LOGIN_RATE', '10/minute'),
        'login_username': os.environ.get('DJANGO_AUTH_LOGIN_USERNAME_RATE', '20/hour'),
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
}

CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', '').split(',') if origin.strip()
]

SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = os.environ.get('DJANGO_SESSION_COOKIE_SAMESITE', 'Lax')
# Default to Secure cookies in production; insecure cookies leak sessions over HTTP.
SESSION_COOKIE_SECURE = os.environ.get('DJANGO_SESSION_COOKIE_SECURE', str(not DEBUG)).lower() in {'1', 'true', 'yes'}
# HttpOnly by default in production because our frontend fetches/forwards CSRF server-side (no JS cookie read needed).
CSRF_COOKIE_HTTPONLY = os.environ.get('DJANGO_CSRF_COOKIE_HTTPONLY', str(not DEBUG)).lower() in {'1', 'true', 'yes'}
CSRF_COOKIE_SAMESITE = os.environ.get('DJANGO_CSRF_COOKIE_SAMESITE', SESSION_COOKIE_SAMESITE)
CSRF_COOKIE_SECURE = os.environ.get(
    'DJANGO_CSRF_COOKIE_SECURE',
    str(SESSION_COOKIE_SECURE),
).lower() in {'1', 'true', 'yes'}



SECURE_SSL_REDIRECT = True 

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

X_FRAME_OPTIONS = "DENY"

SECURE_CONTENT_TYPE_NOSNIFF = True

SECURE_BROWSER_XSS_FILTER = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
