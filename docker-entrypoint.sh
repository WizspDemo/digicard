#!/bin/sh
set -e

echo "Running prisma db push..."
npx --prefix /app prisma db push --skip-generate --accept-data-loss=false || npx prisma db push --schema=/app/prisma/schema.prisma --accept-data-loss=false

exec "$@"
