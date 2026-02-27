import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


def read_env(name: str, *, allow_empty: bool = False) -> str:
    value = os.getenv(name)
    if value is None:
        raise RuntimeError(f'Missing required environment variable: {name}')

    value = value.strip()
    if not allow_empty and not value:
        raise RuntimeError(f'Environment variable {name} cannot be empty.')

    return value


def read_csv_env(name: str, *, allow_empty: bool = False) -> list[str]:
    raw_value = read_env(name, allow_empty=allow_empty)
    if not raw_value:
        return []
    return [item.strip() for item in raw_value.split(',') if item.strip()]


def read_optional_env(name: str) -> str:
    value = os.getenv(name)
    if value is None:
        return ''
    return value.strip()


APP_ENV = read_env('APP_ENV').lower()


if APP_ENV not in {'dev', 'prod'}:
    raise RuntimeError("APP_ENV must be 'dev' or 'prod'.")

IS_PRODUCTION = APP_ENV == 'prod'
DEBUG = not IS_PRODUCTION

SECRET_KEY = read_env('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = read_csv_env('DJANGO_ALLOWED_HOSTS')
if not ALLOWED_HOSTS:
    raise RuntimeError('DJANGO_ALLOWED_HOSTS must include at least one host.')

CSRF_TRUSTED_ORIGINS = read_csv_env('DJANGO_CSRF_TRUSTED_ORIGINS', allow_empty=True)
FRONTEND_URL = read_env('FRONTEND_URL')
COOKIE_DOMAIN = read_env('DJANGO_COOKIE_DOMAIN', allow_empty=True)
COOKIE_DOMAIN = read_optional_env('DJANGO_COOKIE_DOMAIN')
GOOGLE_CLIENT_ID = read_env('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = read_env('GOOGLE_CLIENT_SECRET')
GITHUB_CLIENT_ID = read_env('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = read_env('GITHUB_CLIENT_SECRET')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
    'accounts.apps.AccountsConfig',
    'blog',
    'products',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
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
        'NAME': read_env('POSTGRES_DB'),
        'USER': read_env('POSTGRES_USER'),
        'PASSWORD': read_env('POSTGRES_PASSWORD'),
        'HOST': read_env('POSTGRES_HOST'),
        'PORT': read_env('POSTGRES_PORT'),
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

AUTH_USER_MODEL = 'accounts.User'
SITE_ID = int(read_env('DJANGO_SITE_ID'))

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

ACCOUNT_ADAPTER = 'accounts.adapters.AccountAdapter'
SOCIALACCOUNT_ADAPTER = 'accounts.adapters.SocialAccountAdapter'
ACCOUNT_LOGIN_METHODS = {'username'}
ACCOUNT_SIGNUP_FIELDS = ['username*', 'email*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_UNIQUE_EMAIL = True
SOCIALACCOUNT_LOGIN_ON_GET = True

LOGIN_REDIRECT_URL = f'{FRONTEND_URL}/profile'
LOGOUT_REDIRECT_URL = f'{FRONTEND_URL}/'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': GOOGLE_CLIENT_ID,
            'secret': GOOGLE_CLIENT_SECRET,
            'key': '',
        },
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
    },
    'github': {
        'APP': {
            'client_id': GITHUB_CLIENT_ID,
            'secret': GITHUB_CLIENT_SECRET,
            'key': '',
        },
        'SCOPE': ['read:user', 'user:email'],
    },
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'login': read_env('DJANGO_AUTH_LOGIN_RATE'),
        'login_username': read_env('DJANGO_AUTH_LOGIN_USERNAME_RATE'),
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
}

SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = IS_PRODUCTION
SESSION_COOKIE_DOMAIN = COOKIE_DOMAIN or None

CSRF_COOKIE_HTTPONLY = IS_PRODUCTION
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = IS_PRODUCTION
CSRF_COOKIE_DOMAIN = COOKIE_DOMAIN or None

SECURE_SSL_REDIRECT = IS_PRODUCTION
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000 if IS_PRODUCTION else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = IS_PRODUCTION
SECURE_HSTS_PRELOAD = IS_PRODUCTION

X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
