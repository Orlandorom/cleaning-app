# Roadmap — Cleaning App

## Legend

- ✅ **Done** — implemented, tested, compiling
- 🔜 **Pending** — designed but not implemented
- 📝 **Planned** — identified but not started

---

## Phase 1: Backend Foundation ✅

- [x] NestJS project scaffolding
- [x] Prisma schema with all models (City, Client, Provider, Service, ProviderService, Booking, Review, Otp)
- [x] PrismaModule + PrismaService (global, lifecycle hooks)
- [x] Global ValidationPipe (whitelist, forbidNonWhitelisted, transform)
- [x] Global AllExceptionsFilter (catches all, logs 500s)
- [x] Swagger setup at `/api/docs`
- [x] CORS configuration (env-driven)
- [x] Environment variables (.env)
- [x] Jest configuration (ts-jest)
- [x] JWT_SECRET validation at startup

## Phase 2: Feature Modules ✅

- [x] **Cities** — CRUD, unique name, search by name
- [x] **Services** — CRUD, ServiceType enum, unique name, filter by type
- [x] **Providers** — CRUD, unique phone, city relation, filter by availability/city
- [x] **Clients** — CRUD, unique phone, search by name
- [x] **Bookings** — CRUD, validates FK references, filter by client/provider/status
- [x] **SMS/OTP** — Twilio integration, OTP generation (crypto.randomInt), verification with rate limiting (5 attempts)

## Phase 3: Authentication 🔜

- [ ] Auth module (register, login)
- [ ] JWT token issuance + refresh
- [ ] Passport JWT strategy (guard)
- [ ] Phone verification via OTP (link SMS → Auth)
- [ ] Role-based access (Client vs Admin)

## Phase 4: Review Module 🔜

- [ ] Review CRUD (tied to completed bookings)
- [ ] Rating aggregation on Provider model
- [ ] One review per booking enforcement

## Phase 5: Provider-Service Management 🔜

- [ ] ProviderService module (assign services to providers with pricing)
- [ ] Availability management

## Phase 6: Frontend Mobile 📝

- [ ] Expo project setup (done — scaffold only)
- [ ] Navigation structure
- [ ] Authentication screens
- [ ] Service browsing
- [ ] Booking flow
- [ ] Profile management

## Phase 7: Frontend Admin 📝

- [ ] Vite + React project setup (done — scaffold only)
- [ ] Dashboard layout
- [ ] CRUD management screens (Cities, Services, Providers, Clients, Bookings)
- [ ] User management

## Phase 8: Payments & Integrations 📝

- [ ] Payment gateway integration
- [ ] Invoice/receipt generation
- [ ] Push notifications
- [ ] Email notifications

## Phase 9: Production Readiness 📝

- [ ] Rate limiting (global, per-endpoint)
- [ ] Logging aggregation
- [ ] Monitoring / health checks
- [ ] Error tracking (Sentry)
- [ ] CI/CD pipeline
- [ ] Docker + containerization
- [ ] Domain + SSL
- [ ] Database backups

---

## Current Focus

Phase 2 is **complete**. The next phase to begin is **Phase 3: Authentication**.

All 111 unit tests pass. Backend compiles and runs on port 3000.
