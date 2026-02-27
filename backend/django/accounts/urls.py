from django.urls import path

from .views import SessionCsrfAPIView, SessionLoginAPIView, SessionLogoutAPIView, SessionProfileAPIView

urlpatterns = [
    path('auth/csrf/', SessionCsrfAPIView.as_view(), name='auth-csrf'),
    path('auth/login/', SessionLoginAPIView.as_view(), name='auth-login'),
    path('auth/logout/', SessionLogoutAPIView.as_view(), name='auth-logout'),
    path('auth/profile/', SessionProfileAPIView.as_view(), name='auth-profile'),
]
