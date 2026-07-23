# CLAUDE.md — Cleaning App AI-Driven Development

## Behavior Rules

- **Never write code unless explicitly instructed.** This project uses AI-Driven Development (AIDD). All implementation must be requested via prompts stored in `.claude/PROMPTS/`.
- **Read first, act second.** Always read relevant files before proposing or implementing changes.
- **Follow existing patterns.** Every module (Cities, Services, Providers, Clients, Bookings, SMS) follows an identical structure: `dto/`, `*.service.ts`, `*.controller.ts`, `*.module.ts`, `*.spec.ts`.
- **Do not modify other modules when implementing a new one.** Each feature module is self-contained.
- **Validate with tests.** After any backend implementation, run `npm run build && npm test` inside `backend/`.
- **Documentation changes must be reflected in `.claude/` files.** Keep all project documentation in this directory.
- **Use Spanish for user-facing strings** (error messages, API descriptions, etc.). Use English for code identifiers, comments, and documentation.

## Project Structure

```
cleaning-app/
├── backend/          # NestJS v11 + Prisma v6 + PostgreSQL (Neon) + Twilio
│   ├── src/
│   │   ├── cities/       # CRUD module (example pattern)
│   │   ├── clients/      # CRUD module
│   │   ├── providers/    # CRUD module
│   │   ├── services/     # CRUD module
│   │   ├── bookings/     # CRUD module
│   │   ├── sms/          # OTP/Twilio module
│   │   ├── prisma/       # PrismaService (global)
│   │   ├── common/       # AllExceptionsFilter, shared pipes
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/schema.prisma
│   └── jest.config.js
├── frontend-mobile/  # Expo SDK 52 (React Native)
├── frontend-admin/   # Vite 6 + React 19
└── .claude/          # Project documentation & prompts
```

## Key Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run build` | `backend/` | Compile NestJS |
| `npm test` | `backend/` | Run all Jest tests |
| `npm run start:dev` | `backend/` | Dev server with watch |
| `npm run prisma:generate` | `backend/` | Regenerate Prisma Client |
| `npm run prisma:migrate` | `backend/` | Run pending migrations |

## Module Pattern (Backend)

Every feature module follows this exact structure:

```
module-name/
├── dto/
│   ├── create-{entity}.dto.ts     # class-validator + Swagger
│   ├── update-{entity}.dto.ts     # extends PartialType(CreateDto)
│   └── query-{entity}.dto.ts      # optional filters
├── {entities}.service.ts          # @Injectable(), injects PrismaService
├── {entities}.controller.ts       # @Controller(), 5 CRUD endpoints
├── {entities}.module.ts           # @Module({ controllers, providers })
├── {entities}.service.spec.ts     # Unit tests for service
└── {entities}.controller.spec.ts  # Unit tests for controller
```

## Dependency Injection (Backend)

- `PrismaModule` is `@Global()`, so `PrismaService` is available everywhere without re-importing.
- `ConfigModule` is `@Global()` via `isGlobal: true`, so `ConfigService` is available everywhere.
- Feature modules only need to declare their own controller and service.

## Coding Standards (Summary)

- NestJS controllers: thin — delegate all logic to services.
- Services: all methods are `async`, use PrismaService for DB access.
- DTOs: `class-validator` decorators + `@nestjs/swagger` `@ApiProperty*` decorators.
- Uniqueness validation: check in service layer, throw `ConflictException`.
- Not-found validation: check in service layer, throw `NotFoundException`.
- Always run `npm run build` before `npm test`.

## API Conventions

- Base path: `/api` (via NestJS global prefix, if configured) or direct.
- All endpoints are documented via Swagger at `/api/docs`.
- Standard CRUD: `POST /module`, `GET /module`, `GET /module/:id`, `PATCH /module/:id`, `DELETE /module/:id`.
- Collections ordered by `name` (asc) or `scheduledAt` (desc for bookings).
- Responses always include related entities via Prisma `include`.

## Database Conventions

- `id`: `String @id @default(uuid())`
- `createdAt`: `DateTime @default(now())`
- `updatedAt`: `DateTime @updatedAt` (optional)
- Unique fields: `name` (City, Service), `phone` (Client, Provider)
- Indexes on foreign keys and frequently filtered columns.
- New models go at the end of `schema.prisma`.

## Testing Conventions

- Tests mock `PrismaService` entirely (no real DB).
- Use `@nestjs/testing` `Test.createTestingModule`.
- `jest.clearAllMocks()` in `beforeEach`.
- Service tests: mock each Prisma model method individually.
- Controller tests: mock the service entirely.
- Test all CRUD operations, including error cases (404, 409, 400).
