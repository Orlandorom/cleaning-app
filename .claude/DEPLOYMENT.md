# Deployment — Cleaning App

## Current Status

The application is in **active development** and has NOT been deployed to any environment. This document outlines the deployment strategy.

## Build Commands

### Backend

```bash
cd backend
npm run build                # Compile TypeScript → dist/
npm run start:prod           # Run compiled app (NODE_ENV=production)
```

### Frontend Mobile

```bash
cd frontend-mobile
npx expo build:android       # Build APK/AAB for Google Play
npx expo build:ios           # Build IPA for App Store
# or
npx eas build                # EAS Build (recommended)
```

### Frontend Admin

```bash
cd frontend-admin
npm run build                # Vite builds to dist/
# Serve dist/ with any static file server (nginx, Cloudflare Pages, Vercel)
```

## Environment Variables (Production)

| Variable | Source | Required | Notes |
|----------|--------|----------|-------|
| `DATABASE_URL` | Neon Dashboard | ✅ | Pooled connection string |
| `DIRECT_URL` | Neon Dashboard | ✅ | Direct connection for migrations |
| `JWT_SECRET` | Generated | ✅ | Strong random string (64+ chars) |
| `TWILIO_ACCOUNT_SID` | Twilio Console | ❌ | SMS sending |
| `TWILIO_AUTH_TOKEN` | Twilio Console | ❌ | SMS sending |
| `TWILIO_PHONE_NUMBER` | Twilio Console | ❌ | SMS sending |
| `CORS_ORIGINS` | Custom | ✅ | Production frontend URLs |
| `PORT` | Platform | ❌ | Default 3000 |

## Hosting Options

### Backend (NestJS)

| Platform | Notes |
|----------|-------|
| **Railway** | Good for NestJS + PostgreSQL, automatic deploys from GitHub |
| **Render** | Web service + PostgreSQL, free tier available |
| **Fly.io** | Global edge deployment, Docker support |
| **AWS ECS / Fargate** | For enterprise deployment |
| **Google Cloud Run** | Serverless container, auto-scaling |

### Database (Neon)

- Already on Neon (serverless PostgreSQL).
- Use **Neon branches** for staging/test environments.
- Connection pooling via `DATABASE_URL` (pooled), direct via `DIRECT_URL` for migrations.

### Admin Frontend

| Platform | Notes |
|----------|-------|
| **Vercel** | Zero-config for Vite, automatic deploys |
| **Cloudflare Pages** | Fast CDN, generous free tier |
| **Netlify** | Easy deployment with form handling |

### Mobile Frontend

| Platform | Notes |
|----------|-------|
| **Expo EAS** | Managed build + submit to stores |
| **Google Play Console** | Android distribution |
| **Apple App Store** | iOS distribution |

## CI/CD Pipeline (Planned)

```yaml
# .github/workflows/ci.yml (not yet created)
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd backend && npm ci
      - run: cd backend && npx prisma generate
      - run: cd backend && npm run build
      - run: cd backend && npm test

  deploy-backend:
    needs: test-backend
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - # Deploy to Railway / Render / Fly.io
```

## Prisma Migrations in Production

```bash
# On deploy, run:
npx prisma migrate deploy    # Apply pending migrations (safe)
npx prisma generate          # Regenerate client

# NEVER use in production:
# npx prisma migrate dev     # (Only for development)
# npx prisma db push          # (Can drop data)
```

## Pre-Deployment Checklist

- [ ] All environment variables set in production platform
- [ ] `DATABASE_URL` uses pooled connection (Neon)
- [ ] `JWT_SECRET` is a strong, unique value
- [ ] `CORS_ORIGINS` set to actual production URLs
- [ ] Twilio credentials configured (if SMS needed)
- [ ] Prisma migrations applied (`prisma migrate deploy`)
- [ ] Backend builds successfully (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] No hardcoded secrets in source code
- [ ] HTTPS configured (platform-managed or via reverse proxy)
