# Orden sugerido

## ✅ Fase 0 — Setup
- [x] 0.1 Backend: package.json + NestJS + Prisma + Twilio
- [x] 0.2 Frontend mobile: package.json + Expo
- [x] 0.3 Frontend admin: package.json + Vite + React

## ✅ Fase 1 — Schema Prisma
- [x] 1.1 Modelos Client, Provider, Service + ProviderService
- [x] 1.2 Modelo Booking + enums BookingStatus, ServiceType
- [x] 1.3 Modelo Review + relación con Booking
- [x] 1.4 Migración SQL generada (pendiente aplicar contra BD)

## ✅ Fase 2 — Backend Core
- [x] 2.1 AppModule + main.ts (CORS, ValidationPipe, puerto)
- [x] 2.2 PrismaModule + PrismaService
- [x] 2.3 DTOs de Auth (RegisterDto, LoginDto, VerifyOtpDto)
- [x] 2.4 AuthService — sendOtp (Twilio SMS)
- [x] 2.5 AuthService — verifyOtp + login (JWT)
- [x] 2.6 AuthController — POST /auth/send-otp, POST /auth/verify
- [x] 2.7 JwtAuthGuard + @CurrentUser decorator

## ✅ Fase 3 — Backend Módulos de negocio
- [x] 3.1 ClientsModule — DTOs + Service (CRUD)
- [x] 3.2 ClientsController — GET/PUT /clients/:id
- [x] 3.3 ProvidersModule — DTOs + Service (CRUD + búsqueda)
- [x] 3.4 ProvidersController — GET /providers, GET /providers/:id
- [x] 3.5 ServicesModule — DTOs + Service
- [x] 3.6 ServicesController — GET /services
- [x] 3.7 BookingsModule — DTOs + Service
- [x] 3.8 BookingsController — POST/GET/PATCH /bookings

## ✅ Fase 4 — Frontend Mobile Infraestructura
- [x] 4.1 Dependencias de navegación + axios
- [x] 4.2 Stack Navigator (4 rutas)
- [x] 4.3 api.ts con axios + JWT interceptors
- [x] 4.4 Tipos compartidos

## ✅ Fase 5 — Frontend Mobile Pantallas
- [x] 5.1 Home screen
- [x] 5.2 ClientForm screen
- [x] 5.3 ClientForm → POST /auth/send-otp
- [x] 5.4 Input OTP + POST /auth/verify
- [x] 5.5 ProviderList screen
- [x] 5.6 ProviderList → GET /providers?service=X
- [x] 5.7 Success screen
- [x] 5.8 Flujo completo: Form → List → POST /bookings → Success

## ✅ Fase 6 — Frontend Admin
- [x] 6.1 Dependencias: react-router, axios, react-query
- [x] 6.2 Router (Login, Dashboard, Bookings, Providers)
- [x] 6.3 Login screen
- [x] 6.4 Dashboard screen
- [x] 6.5 Bookings screen (tabla + filtros)
- [x] 6.6 Providers screen (CRUD)

## ✅ Fase 7 — Integración
- [x] 7.1 Backend iniciado y rutas verificadas
- [x] 7.2 Admin build exitoso
- [x] 7.3 Configuración entornos producción
- [x] 7.4 Typecheck pasado en backend, mobile y admin

## ✅ Fase 9 — Autenticación completa
- [x] 9.1 User + RefreshToken models (Prisma)
- [x] 9.2 JWT con Passport (2 tokens + refresh rotation)
- [x] 9.3 RolesGuard + decorador @Roles
- [x] 9.4 5 endpoints auth (register, login, refresh, logout, profile)
- [x] 9.5 131 tests passing

## ✅ Fase 20 — Observabilidad
- [x] 20.1 nestjs-pino logger global + correlation ID middleware
- [x] 20.2 HealthController (/health, /ready)
- [x] 20.3 MetricsController (/metrics, Prometheus)

## ✅ Dockerización
- [x] Dockerfile multi-stage (build + production)
- [x] Dockerfile.dev (hot-reload)
- [x] docker-compose.yml + dev + prod
- [x] Scripts: healthcheck.sh, dev.sh, prod.sh
- [x] .env.example

## ✅ CI/CD (GitHub Actions)
- [x] ci.yml: lint, test, build, docker (4 jobs)
- [x] deploy.yml: push Docker Hub + Render webhook

## ✅ Fase 19 — Frontend Mobile Arquitectura
- [x] Config: package.json, app.json, babel, metro, tailwind, tsconfig, nativewind-env, .env.example
- [x] app/ layouts (root + auth + tabs + 404)
- [x] lib/ (query-client, mmkv, fonts)
- [x] store/ (auth, theme, toast, loading)
- [x] services/ (api.ts Axios + 7 API modules)
- [x] hooks/ (useAuth, useColorScheme, useToast)
- [x] types/ (api, auth)
- [x] theme/ (colors, typography, spacing)
- [x] utils/ (Zod validation, formatters, constants)
- [x] components/ui/ (10 originales)
- [x] features/auth/AuthGuard
- [x] 0 screens business logic — solo arquitectura

## ✅ Design System
- [x] Button — CVA con variant/size/fullWidth + leftIcon/rightIcon + loading + disabled
- [x] Input — label, error, helperText, required, leftIcon/rightIcon, focus ring
- [x] Card — elevated / outlined / ghost + padded
- [x] Avatar — source (imagen) / fallback a iniciales con color determinista + 4 tamaños + 3 variants
- [x] Badge — 5 variants + 2 tamaños + dot + leftIcon
- [x] Chip — filled / outline / ghost + selected + closable + leftIcon
- [x] Modal — RN Modal wrapper + 5 tamaños + close button + backdrop dismiss
- [x] Bottom Sheet — custom con PanResponder + drag-to-close + snapPoint + backdrop
- [x] Loader — spinner / dots + overlay fullScreen + texto opcional
- [x] Skeleton — text / circular / rectangular shimmer + SkeletonGroup para listas
- [x] Header — safe area + leftAction + title + rightActions
- [x] SearchBar — icono + clear button + showCancel + onSubmitEditing
- [x] Select — modal con FlatList + multiple (chips) + searchable + search filter
- [x] DatePicker — custom calendar modal + navegación mes + min/max date
- [x] OTPInput — cajas individuales + keyboard oculto + auto-focus
- [x] Toast — iconos + position (top/bottom) + animation + ToastProvider wrapper
- [x] UI_GUIDELINES.md — documentación completa del Design System

## ✅ Authentication Flow
- [x] Splash screen — app/index.tsx con logo + redirect condicional por auth state
- [x] Welcome screen — branding + botón "Iniciar sesión"
- [x] Login screen — input phone + validación Zod + sendOtp mutation + navega a OTP
- [x] OTP screen — 6 dígitos OTPInput + login mutation + resend
- [x] SessionProvider — hydrate auth store desde MMKV al montar
- [x] Persistencia JWT — MMKV (token, refreshToken, user) + hydrate
- [x] Refresh Token — axios interceptor con queue de peticiones pendientes + setTokens
- [x] Axios Interceptor — request (Bearer token) + response (401→refresh rotation, otros→toast)
- [x] React Query — useSendOtp, useLogin, useLogout mutations
- [x] AuthGuard — redirect a welcome si no autenticado, a tabs si autenticado
