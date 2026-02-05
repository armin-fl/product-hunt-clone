import os
from dataclasses import dataclass

import jwt
from jwt import PyJWKClient
from rest_framework import authentication, exceptions


@dataclass
class ClerkUser:
    user_id: str
    email: str | None = None

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.user_id


class ClerkJWTAuthentication(authentication.BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != self.keyword.lower():
            return None

        token = parts[1]
        try:
            payload = self._decode_token(token)
        except jwt.PyJWTError as exc:
            raise exceptions.AuthenticationFailed('Invalid Clerk token.') from exc

        user_id = payload.get('sub')
        if not user_id:
            raise exceptions.AuthenticationFailed('Invalid Clerk token.')

        return ClerkUser(user_id=user_id, email=payload.get('email')), payload

    def authenticate_header(self, request):
        return self.keyword

    def _decode_token(self, token: str):
        issuer = os.environ.get('CLERK_JWT_ISSUER')
        audience = os.environ.get('CLERK_JWT_AUDIENCE')
        options = {'verify_aud': bool(audience)}

        jwt_key = os.environ.get('CLERK_JWT_KEY')
        if jwt_key:
            public_key = jwt_key.replace('\\n', '\n')
            return jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                issuer=issuer,
                audience=audience,
                options=options,
            )

        jwks_url = os.environ.get('CLERK_JWKS_URL')
        if not jwks_url:
            raise exceptions.AuthenticationFailed('Set CLERK_JWT_KEY or CLERK_JWKS_URL to verify tokens.')

        jwk_client = PyJWKClient(jwks_url)
        signing_key = jwk_client.get_signing_key_from_jwt(token).key
        return jwt.decode(
            token,
            signing_key,
            algorithms=['RS256'],
            issuer=issuer,
            audience=audience,
            options=options,
        )
