# n8n Setup

## Start
1. From the repo root, run:

```bash
docker compose up -d
```

2. Open `http://localhost:5678` and create the initial n8n owner account.

## Workflow Outline
1. Trigger node: Cron or Interval.
2. HTTP Request node: call Product Hunt API and return the JSON payload you showed.
3. Optional: Set or Item Lists node to clean/shape fields.
4. HTTP Request node: POST to `http://localhost:8000/api/ingest/producthunt/`.
5. Add header `Authorization: Bearer <Clerk session token>` to the ingest request.

## Notes
- n8n is configured to use Postgres in `docker-compose.yml`.
- If you want to store secrets, use n8n Credentials instead of hardcoding tokens in nodes.
