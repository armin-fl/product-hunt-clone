from hashlib import sha256

from rest_framework.throttling import SimpleRateThrottle


class LoginUsernameRateThrottle(SimpleRateThrottle):
    """
    Defends against distributed credential stuffing by throttling attempts
    per normalized username in addition to IP-based throttling.
    """

    scope = "login_username"

    def get_cache_key(self, request, view):
        try:
            username = request.data.get("username")
        except Exception:
            return None

        if not isinstance(username, str):
            return None

        normalized_username = username.strip().casefold()
        if not normalized_username:
            return None

        username_hash = sha256(normalized_username.encode("utf-8")).hexdigest()
        return self.cache_format % {"scope": self.scope, "ident": username_hash}
