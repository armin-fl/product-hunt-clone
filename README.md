# Product Hunt Clone (Backend + n8n)

## Structure
- `backend/`
  - `django/` Django + DRF API
  - `n8n/` n8n container build
  - `database/` Postgres container build + init scripts
  - `clerk/` Clerk docs/placeholder
- `Environment/Development/` dev docker-compose + env
- `Environment/Production/` prod docker-compose + env
- `Frontend/` (empty for now)

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
- `GET /api/products/` list products (filter/search/order)
- `GET /api/products/{id}/` product detail
- `POST /api/ingest/producthunt/` ingest Product Hunt JSON

### Filters (examples)
- `?min_votes=100&max_votes=500`
- `?created_after=2026-02-01T00:00:00Z&created_before=2026-02-05T00:00:00Z`
- `?featured_after=2026-02-01T00:00:00Z`
- `?maker_username=someuser`
- `?media_type=image`
- `?has_reviews=true`
- `?ordering=-votes_count`
- `?search=atoms`

## Clerk Auth
Set Clerk keys in `Environment/Development/dev.env` or `backend/django/.env.example`:
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_KEY` (recommended for networkless verification) or `CLERK_JWKS_URL`

The ingest endpoint requires auth (Bearer token). List endpoints are public by default.

## n8n Workflow (high-level)
1. HTTP Request node: call Product Hunt API using the endpoint and token from Product Hunt.
2. Optional: map/transform fields to match the ingest schema.
3. HTTP Request node: POST to `http://localhost:8000/api/ingest/producthunt/` with the JSON.
4. Add the header `Authorization: Bearer <Clerk session token>` to the ingest request.
