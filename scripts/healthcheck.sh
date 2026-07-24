#!/bin/sh
# Health check para el backend de Cleaning App
# Uso: ./scripts/healthcheck.sh [url]
# Por defecto: http://localhost:3000/health

URL="${1:-http://localhost:3000/health}"

response=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null)

if [ "$response" = "200" ]; then
  echo "Health check passed: $URL -> $response"
  exit 0
else
  echo "Health check failed: $URL -> $response"
  exit 1
fi
