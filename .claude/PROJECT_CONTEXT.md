# Project Context — Cleaning App

## Overview

A full-stack web + mobile application for managing home and office cleaning services. The platform connects clients with independent cleaning providers, allowing booking, scheduling, payment (future), and review management.

## Repositories

Single monorepo at `C:\Devs\cleaning-app`.

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | NestJS | ^11.0.0 |
| ORM | Prisma | ^6.19.3 |
| Database | PostgreSQL (Neon Serverless) | — |
| SMS Provider | Twilio | ^5.4.0 |
| Auth | JWT + Passport | ^11.0.0 / ^4.0.1 |
| Validation | class-validator + class-transformer | ^0.14.1 / ^0.5.1 |
| API Docs | Swagger (via @nestjs/swagger) | ^11.4.6 |
| Testing | Jest + ts-jest | ^30.4.2 / ^29.4.12 |
| Mobile Frontend | Expo SDK 52 (React Native) | — |
| Admin Frontend | Vite 6 + React 19 | — |

## Current Status

The **backend** is fully implemented with all six feature modules:

| Module | Status | Description |
|--------|--------|-------------|
| Cities | ✅ Done | CRUD, unique name validation |
| Services | ✅ Done | CRUD, ServiceType enum, unique name |
| Providers | ✅ Done | CRUD, unique phone, city relation |
| Clients | ✅ Done | CRUD, unique phone |
| Bookings | ✅ Done | CRUD, validates FK references (client, provider, service) |
| SMS/OTP | ✅ Done | Twilio integration, OTP generation + verification, rate limiting |

Infrastructure completed:
- PrismaService (global, lifecycle hooks)
- AllExceptionsFilter (global, logs 500s)
- ValidationPipe (whitelist + forbidNonWhitelisted + transform)
- Swagger UI at `/api/docs`
- CORS configurable via `CORS_ORIGINS`
- JWT_SECRET validated at startup

**Frontends** (mobile + admin) **exist as project scaffolds** but have no feature implementation yet.

## Business Logic

- Clients register and book cleaning services
- Providers offer services within specific cities
- Each booking has a status lifecycle: `PENDING → CONFIRMED → IN_PROGRESS → COMPLETED`
- OTP-based phone verification for user authentication
- Reviews are linked to completed bookings (one review per booking)

## Environment Variables

Located in `backend/.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Neon) |
| `DIRECT_URL` | ✅ | Direct connection for migrations |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `TWILIO_ACCOUNT_SID` | ❌ | Twilio SID (SMS works in mock mode without it) |
| `TWILIO_AUTH_TOKEN` | ❌ | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | ❌ | Sender phone number |
| `CORS_ORIGINS` | ❌ | Comma-separated origins (default: `localhost:5173,localhost:19006`) |
| `PORT` | ❌ | Server port (default: 3000) |

## Key Design Decisions

1. **PrismaModule is @Global()** — no need to re-import in feature modules.
2. **ConfigModule.forRoot({ isGlobal: true })** — env vars available everywhere.
3. **Phone as unique identifier** for Clients and Providers (not email).
4. **crypto.randomInt()** for OTP codes (not Math.random()).
5. **In-memory is NOT used for rate limiting** — OTP attempts are persisted in the database via the `Otp` model.
6. **Spanish for user-facing messages**, English for code and documentation.

## Next Steps

Awaiting instructions for:
1. Frontend implementation (mobile and/or admin)
2. Authentication endpoints (login, register)
3. Review module
4. Provider-Service assignment module
5. Payments integration
6. Deployment configuration
