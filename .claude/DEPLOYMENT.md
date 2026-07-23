# Deployment — Cleaning App

> Estrategia completa de deployment para la aplicación. Define cómo se despliega el backend (NestJS + PostgreSQL en Neon), el frontend mobile (Expo) y el frontend admin (Vite), incluyendo Docker, CI/CD, variables de entorno y configuración por entorno.

---

## Índice

1. [Arquitectura de Deploy](#1-arquitectura-de-deploy)
2. [Entornos](#2-entornos)
3. [Backend — NestJS + Neon](#3-backend--nestjs--neon)
4. [Frontend Mobile — Expo](#4-frontend-mobile--expo)
5. [Frontend Admin — Vite + React](#5-frontend-admin--vite--react)
6. [Docker](#6-docker)
7. [Variables de Entorno](#7-variables-de-entorno)
8. [Neon (PostgreSQL Serverless)](#8-neon-postgresql-serverless)
9. [Twilio](#9-twilio)
10. [GitHub Actions — CI/CD](#10-github-actions--cicd)
11. [Estrategia de Branching](#11-estrategia-de-branching)
12. [Runbooks](#12-runbooks)
13. [Monitoreo y Logs](#13-monitoreo-y-logs)
14. [Rollbacks](#14-rollbacks)

---

## 1. Arquitectura de Deploy

### 1.1 Diagrama de Alto Nivel

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Expo      │     │  Vite +     │     │  GitHub      │
│   Mobile    │     │  Admin      │     │  Actions     │
│ (App Store) │     │ (Vercel)    │     │  (CI/CD)     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │    HTTPS          │    HTTPS          │ Push / PR
       │    API calls      │    API calls      │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│              Backend (NestJS)                       │
│         Render / Railway / Fly.io                   │
│                                                     │
│  ┌─────────────┐   ┌─────────────┐                  │
│  │   REST API  │   │  Swagger    │                  │
│  │   :3000     │   │  /api/docs  │                  │
│  └──────┬──────┘   └─────────────┘                  │
│         │                                            │
└─────────┼────────────────────────────────────────────┘
          │
          │  TCP :5432 (SSL)
          ▼
┌─────────────────────┐
│                     │
│  Neon (PostgreSQL)  │
│  Serverless         │
│                     │
│  ┌─────────────────┐│
│  │  main (prod)     ││
│  │  staging (stg)   ││
│  │  dev (personal)  ││
│  └─────────────────┘│
└─────────────────────┘

┌─────────────────────┐
│  Twilio             │
│  SMS API            │
│  (externo)          │
└─────────────────────┘
```

### 1.2 Proveedores

| Componente | Proveedor | Alternativas |
|-----------|-----------|--------------|
| Backend | Render / Railway / Fly.io | Heroku, DigitalOcean App Platform |
| Base de datos | Neon (PostgreSQL serverless) | Supabase, AWS RDS, Railway |
| Frontend Admin | Vercel | Netlify, Cloudflare Pages |
| Frontend Mobile | App Store / Google Play | Expo EAS Build |
| CI/CD | GitHub Actions | GitLab CI, CircleCI |
| SMS | Twilio | — |
| Repositorio | GitHub | — |

### 1.3 URLs por Entorno

| Entorno | Backend | Admin | Swagger |
|---------|---------|-------|---------|
| **Desarrollo** | `http://localhost:3000` | `http://localhost:5173` | `http://localhost:3000/api/docs` |
| **Staging** | `https://api-stg.cleaning-app.com` | `https://stg-admin.cleaning-app.com` | `https://api-stg.cleaning-app.com/api/docs` |
| **Producción** | `https://api.cleaning-app.com` | `https://admin.cleaning-app.com` | `https://api.cleaning-app.com/api/docs` |

---

## 2. Entornos

### 2.1 Desarrollo (Local)

| Característica | Configuración |
|----------------|---------------|
| **Backend** | `npm run start:dev` (NestJS watch mode) |
| **Base de datos** | Neon branch `dev` o PostgreSQL local via Docker |
| **Admin** | `npm run dev` (Vite dev server) |
| **Mobile** | `npx expo start` (Expo dev server) |
| **OTP** | Consola (sin Twilio real) |
| **URL API** | `http://localhost:3000` |

### 2.2 Staging

| Característica | Configuración |
|----------------|---------------|
| **Propósito** | Validación previa a producción |
| **Backend** | Deploy automático desde `develop` |
| **Base de datos** | Neon branch `staging` (independiente) |
| **Admin** | Deploy automático desde `develop` |
| **Mobile** | EAS Build + TestFlight (iOS) / Internal Track (Android) |
| **OTP** | Twilio test credentials (sandbox) |
| **URL API** | `https://api-stg.cleaning-app.com` |

### 2.3 Producción

| Característica | Configuración |
|----------------|---------------|
| **Propósito** | Usuarios reales |
| **Backend** | Deploy manual desde `main` (aprobado) |
| **Base de datos** | Neon branch `main` (producción) |
| **Admin** | Deploy manual desde `main` |
| **Mobile** | App Store / Google Play (revisión) |
| **OTP** | Twilio production credentials |
| **URL API** | `https://api.cleaning-app.com` |
| **SLA objetivo** | 99.9% uptime |

---

## 3. Backend — NestJS + Neon

### 3.1 Build del Backend

```bash
# Compilar TypeScript a JavaScript
cd backend
npm run build

# Verificar que compila
node dist/main.js
```

### 3.2 Deploy Manual a Render

```bash
# 1. Push a GitHub
git push origin main

# 2. Render detecta el push y hace deploy automático
#    O usar CLI:
render deploy

# Render config (render.yaml):
services:
  - type: web
    name: cleaning-app-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    healthCheckPath: /cities
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # Se configura manualmente
```

### 3.3 Deploy Manual a Railway

```bash
# Railway CLI
railway login
railway up

# O via GitHub Integration:
# Conectar repo → Railway detecta backend/ → deploy automático
```

### 3.4 Health Check

El endpoint de health check es un GET a un endpoint público:

```http
GET /cities
# Response 200 → OK
# Response 500 → Error
```

O configurar un endpoint dedicado:

```typescript
// src/health/health.controller.ts
@Get('/health')
async healthCheck() {
  await this.prisma.$queryRaw`SELECT 1`;  // Verificar DB
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

### 3.5 Scripts de npm para Producción

```json
// backend/package.json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:seed": "prisma db seed"
  }
}
```

### 3.6 Start Command en Producción

```bash
# Comando de inicio en el proveedor (Render, Railway, etc.)
npm run prisma:generate && npm run prisma:migrate && npm run start:prod
```

Esto:
1. Genera el cliente Prisma para la plataforma de deploy.
2. Ejecuta migraciones pendientes (sin confirmación).
3. Inicia el servidor NestJS.

### 3.7 Node.js Version

```json
// backend/package.json
"engines": {
  "node": ">=18.0.0"
}
```

Usar **Node.js 18 LTS o 20 LTS** en producción. Configurar en el proveedor:

```bash
# Render: seleccionar Node 18 en dashboard
# Railway: usar nixpacks o runtime config
# .node-version file
18.18.0
```

---

## 4. Frontend Mobile — Expo

### 4.1 Build con EAS

```bash
cd frontend-mobile

# Build para iOS (TestFlight)
eas build --platform ios --profile production

# Build para Android (Play Store)
eas build --platform android --profile production

# Build para staging
eas build --platform ios --profile staging

# Submit a stores
eas submit --platform ios
eas submit --platform android
```

### 4.2 Perfiles de Build (eas.json)

```json
// frontend-mobile/eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "staging": {
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-stg.cleaning-app.com"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.cleaning-app.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "user@email.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "track": "production"
      }
    }
  }
}
```

### 4.3 Variables de Entorno en Expo

En Expo, las variables de entorno para el cliente se exponen con prefijo `EXPO_PUBLIC_`:

```env
# frontend-mobile/.env.production
EXPO_PUBLIC_API_URL=https://api.cleaning-app.com

# frontend-mobile/.env.staging
EXPO_PUBLIC_API_URL=https://api-stg.cleaning-app.com

# frontend-mobile/.env.development
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 4.4 App Stores

| Tienda | Proceso | Tiempo estimado |
|--------|---------|-----------------|
| **App Store (iOS)** | TestFlight → Revisión Apple → Producción | 1-7 días |
| **Google Play (Android)** | Internal Track → Closed Track → Producción | 1-3 días |
| **Expo Go** | Desarrollo (no requiere build) | Instantáneo |

### 4.5 Over-the-Air Updates (Expo Updates)

```bash
# Publicar actualización OTA (sin pasar por stores)
npx expo publish --release-channel staging
npx expo publish --release-channel production
```

Las actualizaciones OTA aplican solo a código JS/Assets (no cambios nativos). Para cambios nativos, se requiere nuevo build.

---

## 5. Frontend Admin — Vite + React

### 5.1 Build

```bash
cd frontend-admin
npm run build
# Output en frontend-admin/dist/
```

### 5.2 Deploy a Vercel

```bash
# Vercel CLI
vercel --prod

# O via GitHub Integration:
# Conectar repo → Vercel detecta frontend-admin/ → deploy automático
```

### 5.3 Configuración de Vercel

```json
// frontend-admin/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 5.4 Variables de Entorno en Vercel

```env
# Configurar en dashboard de Vercel
VITE_API_URL=https://api.cleaning-app.com
```

En Vite, las variables de entorno se exponen con prefijo `VITE_`:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### 5.5 Deploy a Netlify (Alternativa)

```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 6. Docker

### 6.1 Dockerfile — Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src/ ./src/
COPY prisma/ ./prisma/

RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main"]
```

### 6.2 Docker Compose — Desarrollo

```yaml
# docker-compose.yml (raíz del proyecto)
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      target: production
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: cleaning_app
      POSTGRES_PASSWORD: cleaning_app_dev
      POSTGRES_DB: cleaning_app_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 6.3 Docker Compose — Desarrollo con Hot Reload

```yaml
# docker-compose.dev.yml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend/src:/app/src
      - ./backend/prisma:/app/prisma
    command: npm run start:dev
    # ...
```

```dockerfile
# backend/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
```

### 6.4 .dockerignore

```
# backend/.dockerignore
node_modules
.git
.gitignore
coverage
dist
.env
*.md
```

### 6.5 Buenas Prácticas Docker

| Práctica | Implementación |
|----------|---------------|
| Multi-stage build | Builder + Production stages |
| Imagen base Alpine | `node:18-alpine` (~120MB final) |
| No correr como root | `USER node` en production stage |
| Cache de capas | `npm ci` antes de copiar código fuente |
| Healthcheck | `HEALTHCHECK --interval=30s CMD wget --spider http://localhost:3000/cities` |
| Sin secrets en build | Usar `env_file` o secrets de Docker Swarm |

---

## 7. Variables de Entorno

### 7.1 Por Entorno

```env
# ============================================
# DESARROLLO (backend/.env)
# ============================================
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cleaning_app?sslmode=require
JWT_SECRET=dev-secret-key-do-not-use-in-production
JWT_EXPIRATION=60m
CORS_ORIGINS=http://localhost:5173,http://localhost:19006
TWILIO_ACCOUNT_SID=your-test-sid
TWILIO_AUTH_TOKEN=your-test-token
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
NODE_ENV=development
```

```env
# ============================================
# STAGING (dashboard del proveedor)
# ============================================
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cleaning_app_staging?sslmode=require
JWT_SECRET=staging-secret-key
JWT_EXPIRATION=60m
CORS_ORIGINS=https://stg-admin.cleaning-app.com
TWILIO_ACCOUNT_SID=your-test-sid
TWILIO_AUTH_TOKEN=your-test-token
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
NODE_ENV=staging
```

```env
# ============================================
# PRODUCCIÓN (dashboard del proveedor)
# ============================================
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cleaning_app_prod?sslmode=require&pool_timeout=30&connection_limit=5
JWT_SECRET=production-secret-key-64-chars-min
JWT_EXPIRATION=60m
CORS_ORIGINS=https://admin.cleaning-app.com
TWILIO_ACCOUNT_SID=your-prod-sid
TWILIO_AUTH_TOKEN=your-prod-token
TWILIO_PHONE_NUMBER=+12025551234
PORT=3000
NODE_ENV=production
```

### 7.2 Tabla de Variables

| Variable | Desarrollo | Staging | Producción | ¿Sensible? |
|----------|-----------|---------|------------|------------|
| `DATABASE_URL` | Neon branch dev | Neon branch staging | Neon branch main | ✅ Sí |
| `JWT_SECRET` | valor dev | valor staging | valor producción | ✅ Sí |
| `JWT_EXPIRATION` | 60m | 60m | 60m | ❌ No |
| `CORS_ORIGINS` | localhost | staging URLs | producción URLs | ❌ No |
| `TWILIO_ACCOUNT_SID` | test | test | producción | ✅ Sí |
| `TWILIO_AUTH_TOKEN` | test | test | producción | ✅ Sí |
| `TWILIO_PHONE_NUMBER` | test | test | producción | ⚠️ Moderado |
| `PORT` | 3000 | 3000 | 3000 | ❌ No |
| `NODE_ENV` | development | staging | production | ❌ No |

### 7.3 Gestión de Secrets

| Plataforma | Método |
|------------|--------|
| **Render** | Environment Variables en dashboard (encrypted) |
| **Railway** | Environment Variables en dashboard (encrypted) |
| **Vercel** | Environment Variables en dashboard (encrypted) |
| **GitHub Actions** | Repository Secrets (Settings → Secrets and variables → Actions) |
| **Local** | `.env` file (gitignored) |
| **Referencia** | `.env.example` (commitado, sin valores reales) |

---

## 8. Neon (PostgreSQL Serverless)

### 8.1 Conceptos Clave

| Concepto | Descripción |
|----------|------------|
| **Branching** | Cada entorno usa su propia branch de la BD (main, staging, dev) |
| **Serverless** | Escala a cero cuando no hay conexiones |
| **Cold start** | ~500ms en la primera conexión después de inactividad |
| **Pooled URL** | Usar pooled connection para producción (maneja conexiones HTTP) |
| **Direct URL** | Usar direct connection para migraciones y scripts largos |
| **Storage** | 500MB gratis, pago por uso |

### 8.2 Conexiones por Entorno

```env
# PRODUCCIÓN — pooled connection (recomendado para API)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/cleaning_app?sslmode=require&pgbouncer=true&connection_limit=5&pool_timeout=10

# PRODUCCIÓN — direct connection (solo para migraciones)
DIRECT_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/cleaning_app?sslmode=require
```

**IMPORTANTE:** La variable `DATABASE_URL` de producción debe apuntar a **pooled connection** (con `-pooler` en el host y `pgbouncer=true`). La conexión directa se usa solo para scripts admin (migraciones, seeds, backups).

### 8.3 Branches de Neon

| Branch | Propósito | Creación |
|--------|-----------|----------|
| `main` | Producción | Por defecto |
| `staging` | Staging | Branch desde `main` |
| `dev-{nombre}` | Desarrollo personal | Branch desde `main` |
| `pr-{number}` | Preview para PR | Branch desde `main` (automático) |

### 8.4 Prisma + Neon

```prisma
// backend/prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  // Para serverless
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Para migraciones
}
```

```bash
# Migraciones en producción (usar DIRECT_URL)
DATABASE_URL="<pooled>" DIRECT_URL="<direct>" npx prisma migrate deploy
```

### 8.5 Pool de Conexiones

Neon usa **PgBouncer** para el pool de conexiones. Configuración recomendada:

```env
# En producción — Pooled
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/cleaning_app?sslmode=require&pgbouncer=true&connection_limit=5&pool_timeout=10

# Modo transaction (default en Neon)
# Cada transacción usa una conexión del pool
# Ideal para API REST (requests cortos)
```

### 8.6 Manejo de Cold Starts

Neon escala a cero tras 5 minutos de inactividad. La primera conexión después de inactividad es lenta (~500ms).

| Estrategia | Implementación |
|------------|---------------|
| **Pooled connection** | Usar pooled URL para mantener conexión cálida |
| **Keep-alive** | Ping periódico desde la app |
| **Scheduled wake** | Cron job cada 4 minutos (opcional) |
| **Prisma connection pool** | Configurar `connection_limit` para evitar saturación |

### 8.7 Seguridad en Neon

```env
# SSL requerido
DATABASE_URL=...?sslmode=require

# IP Restriction (futuro)
# En Neon dashboard, restringir IPs del proveedor de hosting
```

---

## 9. Twilio

### 9.1 Configuración por Entorno

| Entorno | Tipo de Credencial | Comportamiento |
|---------|-------------------|----------------|
| **Desarrollo** | Test credentials | SMS no se envía realmente (log en consola) |
| **Staging** | Test credentials | SMS no se envía realmente (log en consola) |
| **Producción** | Production credentials | SMS enviado realmente |

### 9.2 Test Credentials (Sandbox)

Twilio provee credenciales de prueba que nunca envían SMS reales:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
TWILIO_PHONE_NUMBER=+15005550006  # Número sandbox
```

Con credenciales de prueba:
- Los SMS no se envían.
- El código OTP se muestra en consola (para desarrollo).
- El número de teléfono debe estar verificado en Twilio Sandbox.

### 9.3 Production Credentials

```env
TWILIO_ACCOUNT_SID=ACzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
TWILIO_AUTH_TOKEN=wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
TWILIO_PHONE_NUMBER=+12025551234  # Número real comprado en Twilio
```

### 9.4 Comportamiento en Código

```typescript
// sms.service.ts
async sendOtp(phone: string): Promise<void> {
  const otp = await this.createOtp(phone);

  if (this.configService.get('NODE_ENV') === 'production') {
    // En producción, enviar SMS real
    await this.twilioClient.messages.create({
      body: `Tu código es: ${otp.code}`,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to: phone,
    });
  } else {
    // En desarrollo/staging, log a consola
    this.logger.log(`[OTP] Código para ${phone}: ${otp.code}`);
  }
}
```

### 9.5 Buenas Prácticas Twilio

| Práctica | Implementación |
|----------|---------------|
| No hardcodear credenciales | Variables de entorno |
| Usar test credentials en staging | `TWILIO_ACCOUNT_SID` de test |
| Validar número antes de enviar | Regex `/^\+[1-9]\d{6,14}$/` |
| Rate limiting | Máximo 5 intentos por OTP |
| Logging sin datos sensibles | No loguear OTPs en producción |
| Costo | Monitorear uso de SMS en dashboard Twilio |

---

## 10. GitHub Actions — CI/CD

### 10.1 Pipeline de CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: cleaning_app_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: ./backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/cleaning_app_test

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/cleaning_app_test
          JWT_SECRET: test-secret
          TWILIO_ACCOUNT_SID: test
          TWILIO_AUTH_TOKEN: test
          TWILIO_PHONE_NUMBER: +1234567890

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: ./backend/coverage/

  lint-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: ./backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

  build-backend:
    runs-on: ubuntu-latest
    needs: [test-backend, lint-backend]
    defaults:
      run:
        working-directory: ./backend

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
```

### 10.2 Pipeline de CD — Backend

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
          wait-for-deployment: true

      # O para Railway:
      # - name: Deploy to Railway
      #   uses: railway/railway-action@v3
      #   with:
      #     railway_token: ${{ secrets.RAILWAY_TOKEN }}
      #     service: backend
```

### 10.3 Pipeline de CD — Admin

```yaml
# .github/workflows/deploy-admin.yml
name: Deploy Admin

on:
  push:
    branches: [main]
    paths:
      - 'frontend-admin/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.4 Pipeline de CD — Mobile (EAS)

```yaml
# .github/workflows/deploy-mobile.yml
name: Deploy Mobile

on:
  push:
    branches: [main]
    paths:
      - 'frontend-mobile/**'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build with EAS
        run: eas build --platform all --profile production --non-interactive
        working-directory: ./frontend-mobile

      - name: Submit to stores
        run: eas submit --platform all --profile production --non-interactive
        working-directory: ./frontend-mobile
```

### 10.5 Secrets de GitHub Actions

| Secret | Propósito |
|--------|-----------|
| `RENDER_API_KEY` | API key de Render para deploy |
| `RENDER_SERVICE_ID` | ID del servicio en Render |
| `RAILWAY_TOKEN` | Token de Railway |
| `VERCEL_TOKEN` | Token de Vercel |
| `VERCEL_ORG_ID` | ID de la organización en Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto en Vercel |
| `EXPO_TOKEN` | Token de Expo para EAS Build |

---

## 11. Estrategia de Branching

### 11.1 Git Flow Simplificado

```
main ────────────────●──────────────●───────────── (producción)
                      \            /
develop ──●─────●─────●────●──────●────────────── (staging)
            \  /     \  /    \  /
feature/    ●●       ●●      ●●                    (desarrollo)
auth       cities  bookings   ...
```

### 11.2 Flujo de Trabajo

| Paso | Descripción |
|------|-------------|
| **1. Feature branch** | `feature/{modulo}` desde `develop` |
| **2. Desarrollo local** | Backend en localhost, Neon branch personal |
| **3. PR a develop** | Code review + CI pasa → merge |
| **4. Deploy a staging** | Automático al hacer merge a `develop` |
| **5. QA en staging** | Validación manual + tests automatizados |
| **6. PR a main** | Code review + CI pasa → merge |
| **7. Deploy a producción** | Automático o manual al hacer merge a `main` |

### 11.3 Convención de Nombres

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Feature | `feature/{modulo}` | `feature/auth`, `feature/payments` |
| Fix | `fix/{descripcion}` | `fix/otp-rate-limit`, `fix/cors-headers` |
| Docs | `docs/{archivo}` | `docs/api-conventions`, `docs/readme` |
| Chore | `chore/{descripcion}` | `chore/update-deps`, `chore/ci-cache` |

---

## 12. Runbooks

### 12.1 Deploy Inicial del Backend

```bash
# 1. Crear proyecto en Render/Railway
# 2. Conectar repositorio de GitHub
# 3. Configurar variables de entorno (sensitive)
# 4. Configurar comando de inicio:
#    npm run prisma:generate && npm run prisma:migrate && npm run start:prod
# 5. Configurar health check: GET /cities
# 6. Configurar dominio personalizado (opcional)
# 7. Hacer push a main → deploy automático
# 8. Verificar health check: curl https://api.cleaning-app.com/cities
# 9. Verificar Swagger: https://api.cleaning-app.com/api/docs
```

### 12.2 Deploy Inicial del Admin

```bash
# 1. Conectar repositorio a Vercel
# 2. Configurar framework: Vite
# 3. Configurar build command: npm run build
# 4. Configurar output directory: dist
# 5. Configurar variable VITE_API_URL
# 6. Deploy automático
# 7. Verificar: https://admin.cleaning-app.com
```

### 12.3 Deploy Inicial del Mobile

```bash
# 1. Instalar EAS CLI: npm i -g eas-cli
# 2. Login: eas login
# 3. Configurar proyecto: eas init
# 4. Configurar eas.json con perfiles
# 5. Build: eas build --platform all --profile production
# 6. Submit: eas submit --platform all --profile production
```

### 12.4 Actualizar Variable de Entorno

```bash
# Render
# 1. Dashboard → Environment → Edit variable
# 2. Guardar → Deploy automático

# Railway
# 1. Dashboard → Variables → Edit
# 2. Guardar → Deploy automático

# Vercel
# 1. Dashboard → Settings → Environment Variables
# 2. Guardar → Redeploy necesario
```

### 12.5 Migración de Base de Datos

```bash
# 1. Hacer cambios en schema.prisma
# 2. Generar migración en local:
#    npx prisma migrate dev --name descripcion
# 3. Commitear archivos de migración
# 4. En deploy, se ejecuta automáticamente:
#    npx prisma migrate deploy

# Rollback (si es necesario):
#  npx prisma migrate down 1
```

### 12.6 Verificar Deploy

```bash
# Health check del backend
curl -s https://api.cleaning-app.com/cities | head -c 100
# Esperado: [{"id":"uuid","name":"Bogotá",...}]

# Swagger
curl -s -o /dev/null -w "%{http_code}" https://api.cleaning-app.com/api/docs
# Esperado: 200

# Endpoint protegido (debe dar 401)
curl -s -o /dev/null -w "%{http_code}" https://api.cleaning-app.com/bookings
# Esperado: 401

# Verificar CORS
curl -s -H "Origin: https://admin.cleaning-app.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  -o /dev/null -w "%{http_code}" \
  https://api.cleaning-app.com/cities
# Esperado: 204
```

---

## 13. Monitoreo y Logs

### 13.1 Logging en Producción

| Herramienta | Propósito | Configuración |
|-------------|-----------|--------------|
| **NestJS Logger** | Logs de aplicación | Ya implementado en `AllExceptionsFilter` |
| **Render/Railway logs** | Logs de plataforma | Dashboard del proveedor |
| **Sentry** (futuro) | Error tracking | Capturar excepciones no manejadas |
| **Logtail / Better Stack** (futuro) | Log management | Agregación de logs |

### 13.2 Alertas

| Evento | Alerta | Canal |
|--------|--------|-------|
| Error 500 > 5 en 1 min | Critico | Email + Slack + SMS |
| Health check falla > 3 veces | Critico | Email + Slack + SMS |
| DB CPU > 80% | Warning | Slack |
| SSL cert expira en < 30 días | Warning | Email |

### 13.3 Logs Sensibles

```typescript
// ❌ Nunca loguear en producción:
// - Códigos OTP
// - Tokens JWT
// - Passwords
// - DATABASE_URL completa

// ✅ Siempre loguear:
// - ID de recurso creado/actualizado/eliminado
// - ID de usuario que realizó la acción
// - Código de error (sin datos sensibles)
// - Tiempo de respuesta de endpoints lentos
```

---

## 14. Rollbacks

### 14.1 Rollback de Backend

```bash
# Render
# Dashboard → Deploys → Último deploy exitoso → Manual Rollback

# Railway
# Dashboard → Deploy → Versión anterior → Rollback

# GitHub Actions (revert commit)
git revert HEAD
git push origin main
# → Deploy automático con versión anterior
```

### 14.2 Rollback de Base de Datos

```bash
# 1. Revertir migración
npx prisma migrate down 1

# 2. O restaurar desde backup
# Neon → Dashboard → Branch → Restore from backup

# 3. O usar branching de Neon
# Crear branch desde el punto anterior al deploy
```

### 14.3 Rollback de Mobile

```bash
# iOS: Rechazar la build en App Store Connect
# Android: Deactive la versión en Google Play Console

# Para OTA updates:
# npx expo publish --release-channel previous-version
```

### 14.4 Principios de Rollback

| Principio | Descripción |
|-----------|-------------|
| **Rollback primero, debug después** | Restaurar servicio antes de investigar causa raíz |
| **Migraciones reversibles** | Cada migración debe tener `down` (generado por Prisma) |
| **Backup automático** | Neon hace backup automático cada hora |
| **Zero-downtime (futuro)** | Múltiples instancias con blue-green deployment |

---

*Documento de deployment — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
