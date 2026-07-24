# Changelog — Cleaning App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- (no unreleased changes)

---

## [0.6.0] — 2026-07-24

### Added

- **GitHub Actions CI/CD** — Complete workflow pipelines
  - `.github/workflows/ci.yml` — CI pipeline with 4 jobs:
    - `lint` — TypeScript type checking (`tsc --noEmit`) + Prisma generate
    - `test` — Unit tests with PostgreSQL 16 service container, migrations, coverage upload
    - `build` — NestJS compilation, dist artifact upload (7 day retention)
    - `docker` — Docker image build with BuildKit cache (no push), depends on `build`
  - `.github/workflows/deploy.yml` — Deploy pipeline with:
    - Build, test, Docker build & push to Docker Hub
    - Render deploy via webhook hook
    - Railway deploy (commented, ready)
    - `workflow_dispatch` for manual staging/production triggers
  - `npm run lint` script (`tsc --noEmit`) added to backend package.json
  - CI runs on push to `main`/`develop` and PRs to `main`
  - Docker BuildKit layer caching via `type=gha`

### Infrastructure

- `actions/checkout@v4`, `actions/setup-node@v4`, `docker/setup-buildx-action@v3`, `docker/build-push-action@v6`, `actions/upload-artifact@v4`

---

## [0.5.0] — 2026-07-24

### Added

- **Dockerization** — Full Docker setup for backend
  - `backend/Dockerfile` — Multi-stage production build (Node 20 Alpine, ~120MB)
  - `backend/Dockerfile.dev` — Development image with hot reload
  - `backend/.dockerignore` — Optimized build context exclusions
  - `docker-compose.yml` — Base compose with backend service + healthcheck
  - `docker-compose.dev.yml` — Dev overrides (volume mounts, hot reload)
  - `docker-compose.prod.yml` — Prod overrides (resource limits, JSON logging)
  - `backend/.env.example` — Reference environment variables template
  - `.env.example` — Root-level environment template
  - `scripts/dev.sh` — One-command dev startup
  - `scripts/prod.sh` — One-command prod startup
  - `scripts/healthcheck.sh` — External health check utility
  - `backend/scripts/healthcheck.sh` — Internal container health check
  - HEALTHCHECK instruction in both Dockerfiles (curl to /health)
  - Production container uses `USER node` for security
  - Resource limits (CPU/Memory) in production compose
  - JSON file logging with rotation in production

### Documentation

- `DEPLOYMENT.md` — Updated Section 6 (Docker) with real file contents
- `DEPLOYMENT.md` — Updated Section 3.4 (Health Check) to use /health endpoint
- `DEPLOYMENT.md` — Updated Section 13 (Monitoreo) to include pino and correlation ID
- `DEPLOYMENT.md` — Updated Section 12.6 (Verificar Deploy) with health, ready, metrics

---

## [0.4.0] — 2026-07-23

### Added

- **Observability** — Logging, health checks, metrics
  - `nestjs-pino` as global logger with structured JSON output
  - `pino-pretty` transport in development for human-readable logs
  - Correlation ID (`x-correlation-id`) in all requests and responses
  - Request/Response logging via pino-http auto-logger
  - Error logging with correlation ID context
  - `GET /health` — Database connectivity health check via `@nestjs/terminus`
  - `GET /ready` — Readiness probe for Kubernetes/orchestration
  - `GET /metrics` — Prometheus metrics (default metrics + HTTP metrics)
  - `prom-client` with `collectDefaultMetrics` for Node.js metrics
  - Health and metrics endpoints excluded from access logs
  - 0 new tests (infrastructure-only, no business logic)

### Infrastructure

- `bufferLogs: true` in NestFactory to capture bootstrap logs with pino
- `PrismaHealthIndicator` for database health checks

---

## [0.3.0] — 2026-07-23

### Added

- **Auth Module** — Complete JWT + OTP authentication implementation
  - `User` + `RefreshToken` models in Prisma schema
  - `POST /auth/register` — Register with phone + OTP, auto-creates Client or Provider
  - `POST /auth/login` — Login with phone + OTP
  - `POST /auth/refresh` — Refresh token rotation (old token revoked)
  - `POST /auth/logout` — Revoke all user refresh tokens (JWT protected)
  - `GET /auth/profile` — Get authenticated user with client/provider data included
  - `JwtAuthGuard` — Protects routes with Bearer JWT
  - `RolesGuard` — Role-based authorization (`@Roles('ADMIN')`)
  - `@CurrentUser()` decorator — Extracts user from request
  - `JwtStrategy` — Validates JWT from `Authorization: Bearer` header
  - Swagger documentation with `@ApiBearerAuth()` on protected endpoints
  - 20 new unit tests (14 service + 6 controller)
- All validation messages in Spanish
- Phone validation with international format regex

---

## [0.2.0] — 2026-07-23

### Added

- **SMS/OTP Module** — Complete implementation with Twilio integration
  - `Otp` model in Prisma schema (phone, code, expiresAt, verified, attempts)
  - OTP generation using `crypto.randomInt(100000, 999999)`
  - Twilio SMS sending (with console fallback for development)
  - OTP verification with rate limiting (max 5 attempts per code)
  - `POST /sms/otp/send` and `POST /sms/otp/verify` endpoints
  - Swagger documentation for all SMS endpoints
  - 8 new unit tests (5 service + 3 controller)
  - Phone validation with international format regex
- **Bookings Module** — Complete CRUD implementation
  - FK validation (verifies client, provider, and service exist on creation)
  - Filter by clientId, providerId, status
  - Ordered by scheduledAt descending
  - Includes related entities (client, provider, service) in responses
  - 23 new unit tests (14 service + 9 controller)
- **Clients Module** — Complete CRUD implementation
  - Unique phone validation with ConflictException
  - Search by name (case-insensitive)
  - 21 new unit tests (12 service + 9 controller)
- **Providers Module** — Complete CRUD implementation
  - Unique phone validation
  - Filter by search, isAvailable, cityId
  - Includes city relation in all responses
  - 22 new unit tests (13 service + 9 controller)
- **Services Module** — Complete CRUD implementation
  - ServiceType enum validation with `@IsEnum()`
  - Unique name validation
  - Filter by search and type
  - 21 new unit tests (12 service + 9 controller)
- **Cities Module** — Complete CRUD implementation
  - Unique name validation with ConflictException
  - Search by name (case-insensitive)
  - 19 new unit tests (10 service + 9 controller)
- **Jest configuration** — `jest.config.js` with ts-jest transform
- **All modules registered** in `app.module.ts`

### Infrastructure

- Global `ValidationPipe` with whitelist, forbidNonWhitelisted, transform
- Global `AllExceptionsFilter` catching all exceptions, logging 500s
- Swagger UI at `/api/docs` with bearer auth configured
- CORS configurable via `CORS_ORIGINS`
- PrismaModule as @Global() for simplified DI

## [0.1.0] — 2026-07-22

### Added

- Initial NestJS v11 project scaffolding
- Prisma v6 with PostgreSQL (Neon) schema
- City, Client, Provider, Service, ProviderService, Booking, Review models
- ConfigModule with .env support
- @nestjs/swagger + swagger-ui-express setup
- Frontend scaffolds: Expo SDK 52 (mobile) and Vite 6 + React 19 (admin)
- Project documentation: `docs/ARCHITECTURE.md`, `docs/TASKS.md`
