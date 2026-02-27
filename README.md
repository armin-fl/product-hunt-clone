# Product Hunt Clone (Backend + n8n)

## Structure
- `backend/`
  - `django/` Django + DRF API
  - `n8n/` n8n container build
  - `database/` Postgres container build + init scripts
- `Environment/Development/` dev docker-compose + env
- `Environment/Production/` prod docker-compose + env
- `Frontend/` Next.js 16 frontend

## Quick Start (dev)
1. Update `Environment/Development/dev.env`.
2. Start services:

```bash
docker compose up -d
```

n8n will be at `http://localhost:5678`, Django at `http://localhost:8000`.

## Django API
The compose file runs Django with `migrate` on startup and serves via `runserver`.
If you want to run it locally (without docker), use the steps below:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Endpoints
- `GET /api/products/` list products (paginated)
- `GET /api/products/{slug}/` product detail
- `POST /api/ingest/producthunt/` ingest Product Hunt JSON
- `POST /api/auth/login/` start a session with `username` + `password`
- `POST /api/auth/logout/` end current session
- `GET /api/auth/profile/` get the logged-in user
- `GET /api/auth/csrf/` issue a CSRF cookie/token for authenticated writes

## Session Auth
The backend now uses Django session authentication with HttpOnly cookies and CSRF protection for state-changing requests.
Set these in `Environment/Development/dev.env` or `backend/django/.env.example`:
- `DJANGO_SESSION_COOKIE_SAMESITE`
- `DJANGO_SESSION_COOKIE_SECURE`
- `DJANGO_CSRF_COOKIE_HTTPONLY`
- `DJANGO_CSRF_COOKIE_SAMESITE`
- `DJANGO_CSRF_COOKIE_SECURE`
- `DJANGO_AUTH_LOGIN_RATE`

To create a login user in development:

```bash
python manage.py createsuperuser
```

Protected endpoints (for example `POST /api/ingest/producthunt/`) require a logged-in session.
Before calling login/logout/other write endpoints from API clients, initialize CSRF with `GET /api/auth/csrf/`, then send both the `csrftoken` cookie and `X-CSRFToken` header.

## n8n Workflow (high-level)
1. HTTP Request node: call Product Hunt API using the endpoint and token from Product Hunt.
2. Optional: map/transform fields to match the ingest schema.
3. HTTP Request node: POST to `http://localhost:8000/api/ingest/producthunt/` with the JSON.
4. Initialize CSRF via `GET /api/auth/csrf/`, then authenticate via `POST /api/auth/login/` and include both `sessionid` + `csrftoken` cookies with `X-CSRFToken` on ingest requests.

## Frontend (Next.js)
The frontend lives in `Frontend/`.

```bash
cd Frontend
npm install
npm run dev
```

Set API base in `Frontend/.env.local` (example in `Frontend/.env.local.example`):

```
API_BASE_URL=http://localhost:8000
SITE_URL=http://localhost:3000
```
