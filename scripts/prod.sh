#!/bin/bash
# Iniciar entorno de producción con Docker Compose
# Uso: ./scripts/prod.sh

set -e

echo "🚀 Iniciando Cleaning App en modo producción..."

docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
