#!/bin/sh
# Health check para el backend (Docker)
# Se llama desde HEALTHCHECK del Dockerfile

curl -f http://localhost:3000/health || exit 1
