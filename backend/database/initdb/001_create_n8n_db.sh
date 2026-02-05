#!/bin/sh
set -e

N8N_DB_NAME="${DB_POSTGRESDB_DATABASE:-n8n_db}"

echo "Creating n8n database '${N8N_DB_NAME}' if it does not exist..."
if psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_database WHERE datname='${N8N_DB_NAME}'" | grep -q 1; then
  echo "Database ${N8N_DB_NAME} already exists."
else
  createdb -U "$POSTGRES_USER" "$N8N_DB_NAME"
fi
