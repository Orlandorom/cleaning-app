#!/bin/bash
# Iniciar entorno de desarrollo con Docker Compose
# Uso: ./scripts/dev.sh

set -e

echo "🚀 Iniciando Cleaning App en modo desarrollo..."

docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
