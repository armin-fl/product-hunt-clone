# Product Hunt Clone (Backend + n8n + Frontend)

## Structure
- `backend/`
  - `django/` Django + DRF API + session auth + django-allauth
  - `n8n/` n8n container build
  - `database/` Postgres container build + init scripts
- `Environment/Development/` dev docker-compose + env
- `Environment/Production/` prod docker-compose + env
- `Frontend/` Next.js 16 frontend

## Environment Mode
Backend runs in exactly one mode:
- `APP_ENV=dev`
- `APP_ENV=prod`

`config/settings.py` now uses strict required env vars (no fallback defaults).

## Quick Start (dev)
1. Update `Environment/Development/dev.env`.
2. Start services:

```bash
docker compose -f Environment/Development/docker-compose.yml up -d
```

3. Frontend:

```bash
cd Frontend
cp env.development.example .env.local
npm install
npm run dev
```

## Django API

### Public read endpoints
- `GET /api/products/`
- `GET /api/products/{slug}/`
- `GET /api/blog-posts/`

### Auth/session endpoints
- `GET /api/auth/csrf/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/profile/`
- `GET /api/auth/social/google/login/?next=http://localhost:3000/profile`
- `GET /api/auth/social/github/login/?next=http://localhost:3000/profile`

### Auth pages (django-allauth)
- `GET /accounts/signup/`
- `GET /accounts/login/`
- `GET /accounts/logout/`

### Protected write endpoints
- `POST /api/ingest/producthunt/` is now `IsAdminUser` only.

## Authentication Model
- Custom user model: `accounts.User` (`AUTH_USER_MODEL`).
- Expandable profile model: `accounts.UserProfile` (`OneToOne` with user).
- Profile is auto-created via signal for each new user.
- Normal users are non-staff and can use login/profile flows.
- Django admin access remains staff-only.

## Social Login Setup (Google + GitHub)
Set these env vars in `dev.env` / `prod.env`:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Recommended callback URLs:
- Google: `http://localhost:8000/accounts/google/login/callback/`
- GitHub: `http://localhost:8000/accounts/github/login/callback/`

Production callback URLs should use your HTTPS API domain.

## Cookie + Frontend/Backend Domain Notes
- `DJANGO_COOKIE_DOMAIN` controls cross-subdomain cookie sharing.
- For local (`localhost`), keep it empty.
- For production split domains (for example `app.example.com` + `api.example.com`), set:
  - `DJANGO_COOKIE_DOMAIN=.example.com`

This is required for frontend session proxy routes to consistently receive session/CSRF cookies across subdomains.

## Migrations
After pulling these changes:

```bash
cd backend/django
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
```
