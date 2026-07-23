# Security Guidelines — Cleaning App

## Environment Variables

- All secrets are stored in `backend/.env` (gitignored).
- Required secrets: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`.
- Optional secrets: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.
- `JWT_SECRET` is validated at application startup — if missing, the server logs an error and exits.

## Authentication

### Current State

- JWT + Passport (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`) are installed as dependencies.
- Swagger config includes `.addBearerAuth()`.
- **Auth endpoints (register, login, token refresh) are not yet implemented.**

### Implementation Guidelines (Future)

- Passwords must be hashed with `bcrypt` (or similar).
- JWT tokens should have a short expiry (15–60 minutes) with refresh token support.
- The JWT payload must include: `sub` (userId), `role` (client/admin).
- All protected routes should use `@UseGuards(JwtAuthGuard)`.
- Auth module should validate phone via OTP before registration.

## OTP Security

- OTP codes are generated using `crypto.randomInt(100000, 999999)` — cryptographically secure, NOT `Math.random()`.
- OTP expires after **10 minutes** (`expiresAt` field).
- Maximum **5 verification attempts** per OTP code — after that, the user must request a new code.
- Failed attempts are tracked in the database (`Otp.attempts`) — not in memory.
- OTP is sent via Twilio when configured; otherwise, it is logged to the console for development.
- OTP codes are 6 digits.

## Password Security (Future)

- Minimum 8 characters.
- Must contain at least one uppercase letter, one lowercase letter, one number.
- Hashed with bcrypt (cost factor ≥ 10).
- Never logged or returned in API responses.

## CORS

- Configured via `CORS_ORIGINS` environment variable (comma-separated).
- Default: `http://localhost:5173,http://localhost:19006` (admin + mobile dev).
- In production, restrict to the actual frontend domains.
- `credentials: true` is enabled for cookie/session support.

## Input Validation

- All inputs are validated by the global `ValidationPipe` with:
  - `whitelist: true` — strips unknown properties
  - `forbidNonWhitelisted: true` — rejects requests with unknown properties
  - `transform: true` — auto-transforms types (string → number, etc.)
- DTOs use `class-validator` decorators for type, format, and length validation.
- Phone numbers are validated against the international format regex: `/^\+[1-9]\d{6,14}$/`.

## Database Security

- `DATABASE_URL` uses `sslmode=require` for encrypted connections.
- `DIRECT_URL` uses `sslmode=require` and `channel_binding=require`.
- Prisma Client is the only database access layer — no raw SQL queries.
- Foreign key constraints prevent orphaned records.
- Cascade deletes are used only where appropriate (e.g., deleting a booking deletes its review).

## Error Handling

- No stack traces are exposed to the client in production.
- 500 errors are logged server-side with full stack trace via `AllExceptionsFilter`.
- Client receives only `{ statusCode, message, timestamp }` — no internal details.
- Validation errors include field-level messages from `class-validator`.

## Rate Limiting

- OTP verification: max 5 attempts per OTP code (database-enforced).
- Global rate limiting (e.g., `@nestjs/throttler`) is **not yet implemented** — planned for Phase 9.

## API Key / Auth Tokens (Future)

- JWT Bearer tokens in `Authorization` header.
- Tokens must be transmitted over HTTPS only.
- Token blacklisting for logout (future, requires Redis or database store).

## Secrets Checklist

- [ ] `.env` is in `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] `JWT_SECRET` is validated at startup
- [ ] `sslmode=require` on database connections
- [ ] Swagger `.addBearerAuth()` configured
- [ ] Passport JWT strategy installed
