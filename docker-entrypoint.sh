#!/bin/sh
set -e

echo "Running prisma db push..."
node /app/node_modules/prisma/build/index.js db push --schema=/app/prisma/schema.prisma --skip-generate --accept-data-loss

echo "Seeding initial admin user (if configured)..."
node /app/scripts/seed-admin.js

exec "$@"
