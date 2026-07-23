# Architecture — Cleaning App

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │  frontend-mobile │  │       frontend-admin             │  │
│  │  (Expo SDK 52)   │  │    (Vite 6 + React 19)          │  │
│  │  React Native    │  │    Web Dashboard                 │  │
│  └────────┬─────────┘  └──────────────┬───────────────────┘  │
└───────────┼───────────────────────────┼──────────────────────┘
            │                           │
            └──────────┬────────────────┘
                       │ HTTP / JSON
                       ▼
            ┌──────────────────────┐
            │   NestJS Backend     │
            │   (port 3000)        │
            │                      │
            │  ┌────────────────┐  │
            │  │  Swagger UI    │  │
            │  │  /api/docs     │  │
            │  └────────────────┘  │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   PostgreSQL (Neon)  │
            │   Serverless         │
            └──────────────────────┘
```

## Backend Architecture (NestJS)

### Module Structure

```
src/
├── app.module.ts              # Root module — imports all feature modules
├── main.ts                    # Bootstrap: pipes, filters, CORS, Swagger, logger
│
├── prisma/
│   ├── prisma.module.ts       # @Global() module
│   └── prisma.service.ts      # Extends PrismaClient, handles connect/disconnect
│
├── common/
│   └── filters/
│       └── all-exceptions.filter.ts  # @Catch() global HTTP exception filter
│
├── cities/          # Feature module (reference pattern)
├── clients/         # Feature module
├── providers/       # Feature module
├── services/        # Feature module
├── bookings/        # Feature module
└── sms/             # Utility module (OTP + Twilio)
```

### Request Lifecycle

1. HTTP Request → NestJS Server
2. Global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
3. Global `AllExceptionsFilter` (catches all unhandled errors)
4. Controller route handler (thin — delegates to service)
5. Service method (business logic, Prisma queries)
6. PrismaService → PostgreSQL (Neon)
7. Response returned as JSON

### Module Pattern (CRUD)

Each CRUD module follows a strict template:

- **DTOs** (`dto/`): `Create*Dto`, `Update*Dto` (extends `PartialType(Create*Dto)` via Swagger), `Query*Dto` (optional filters)
- **Service** (`*.service.ts`): `@Injectable()`, injects `PrismaService`, all methods async
- **Controller** (`*.controller.ts`): `@Controller('plural')`, 5 endpoints (`POST`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`)
- **Module** (`*.module.ts`): `@Module({ controllers: [...], providers: [...] })`
- **Tests** (`*.service.spec.ts`, `*.controller.spec.ts`): Jest with mocked PrismaService

### Dependency Injection

- `PrismaModule` is `@Global()` — `PrismaService` injectable anywhere without imports.
- `ConfigModule.forRoot({ isGlobal: true })` — `ConfigService` injectable anywhere.
- Feature modules only list their own controller and service in `@Module()`.

## Frontend Architecture

### Mobile (`frontend-mobile/`)

- Expo SDK 52 with React Native
- TypeScript
- Connects to backend via HTTP (REST)

### Admin (`frontend-admin/`)

- Vite 6 + React 19
- TypeScript
- Dashboard-style UI for managing cities, services, providers, clients, bookings
- Connects to backend via HTTP (REST)

## Data Flow

```
[Mobile App] ──REST──▶ [NestJS API] ──Prisma──▶ [Neon PostgreSQL]
                              │
                              ├── Swagger Docs
                              └── Twilio (SMS)
```

## Error Handling Strategy

- **Validation errors**: `ValidationPipe` throws `BadRequestException` (400) with field details.
- **Not found**: Service throws `NotFoundException` (404).
- **Conflict**: Service throws `ConflictException` (409) for uniqueness violations.
- **Unhandled errors**: `AllExceptionsFilter` catches everything, logs 500s with stack trace, returns `{ statusCode, message, timestamp }`.

## Security Architecture

- JWT-based authentication (Passport strategy, module installed but auth endpoints not yet built)
- OTP via Twilio for phone verification
- Rate limiting: max 5 OTP verification attempts per code, enforced at database level
- JWT_SECRET validated at application startup (no insecure fallback)
- CORS configurable via environment variable
