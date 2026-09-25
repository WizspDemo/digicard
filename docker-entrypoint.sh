#!/bin/sh
set -e

echo "Running prisma db push..."
/app/node_modules/.bin/prisma db push --schema=/app/prisma/schema.prisma --skip-generate --accept-data-loss

exec "$@"
