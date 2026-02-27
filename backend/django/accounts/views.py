from urllib.parse import urlencode, urlparse

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .throttles import LoginUsernameRateThrottle


def _serialize_user(user):
    profile = getattr(user, 'profile', None)
    return {
        'id': user.id,
        'username': user.get_username(),
        'email': user.email,
        'profile': {
            'display_name': profile.display_name if profile else '',
            'bio': profile.bio if profile else '',
            'avatar_url': profile.avatar_url if profile else '',
            'website': profile.website if profile else '',
            'location': profile.location if profile else '',
        },
    }


def _build_safe_next_url(next_url: str | None) -> str:
    default_url = f'{settings.FRONTEND_URL.rstrip("/")}/profile'
    if not next_url:
        return default_url

    frontend = urlparse(settings.FRONTEND_URL)
    parsed = urlparse(next_url)

    if parsed.scheme and parsed.netloc:
        if parsed.scheme in {'http', 'https'} and parsed.netloc == frontend.netloc:
            return next_url
        return default_url

    if next_url.startswith('/'):
        return f'{settings.FRONTEND_URL.rstrip("/")}{next_url}'

    return default_url

@method_decorator(never_cache, name="dispatch")  # Don't cache CSRF tokens in browsers/proxies.
@method_decorator(ensure_csrf_cookie, name='dispatch')
class SessionCsrfAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({'csrfToken': get_token(request)}, status=status.HTTP_200_OK)


# DRF's APIView is CSRF-exempt by default; explicitly protect login to prevent login-CSRF and
# to keep the session cookie issuance behind a valid CSRF token.
@method_decorator(csrf_protect, name="dispatch")
@method_decorator(sensitive_post_parameters("password"), name="dispatch")  # Avoid leaking passwords in error reports.
@method_decorator(never_cache, name="dispatch")  # Login responses should never be cached.
class SessionLoginAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle, LoginUsernameRateThrottle]
    throttle_scope = 'login'

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Both username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        return Response(_serialize_user(user), status=status.HTTP_200_OK)


@method_decorator(csrf_protect, name="dispatch")  # Defense-in-depth: logout is state-changing.
@method_decorator(never_cache, name="dispatch")  # Avoid caching auth state transitions.
class SessionLogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(never_cache, name="dispatch")  # Contains user PII; should not be cached.
class SessionProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(_serialize_user(request.user), status=status.HTTP_200_OK)


@method_decorator(never_cache, name='dispatch')
class SocialLoginStartAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    allowed_providers = {'google', 'github'}

    def get(self, request, provider):
        provider = provider.lower()
        if provider not in self.allowed_providers:
            return Response({'detail': 'Unsupported provider.'}, status=status.HTTP_400_BAD_REQUEST)

        next_url = _build_safe_next_url(request.query_params.get('next'))
        login_path = reverse(f'{provider}_login')
        query_string = urlencode({'process': 'login', 'next': next_url})
        return redirect(f'{login_path}?{query_string}')
