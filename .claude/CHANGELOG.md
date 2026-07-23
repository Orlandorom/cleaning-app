# Changelog — Cleaning App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- `.claude/` directory with comprehensive project documentation for AI-Driven Development
  - `CLAUDE.md` — AI behavior rules, project structure, key commands
  - `PROJECT_CONTEXT.md` — Full project overview and current status
  - `ARCHITECTURE.md` — System architecture and component design
  - `ROADMAP.md` — Development phases and progress tracking
  - `CODING_STANDARDS.md` — Code style and structural conventions
  - `API_CONVENTIONS.md` — API design patterns and endpoint documentation
  - `DATABASE_GUIDELINES.md` — Prisma schema and query conventions
  - `SECURITY.md` — Auth, OTP, and security best practices
  - `UI_GUIDELINES.md` — Frontend design and component conventions
  - `TESTING.md` — Test patterns, mocking strategies, coverage targets
  - `DEPLOYMENT.md` — Build, deploy, and CI/CD strategy
  - `CHANGELOG.md` — Version history (this file)
  - `PROMPTS/` — Directory for AI-driven development prompts

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
