# Arquitectura

## Backend
- **Runtime:** NestJS v11 + TypeScript
- **ORM:** Prisma v6 + PostgreSQL (Neon)
- **Auth:** JWT (Passport) + SMS OTP (Twilio) + Refresh Tokens
- **Observability:** nestjs-pino (logger), @nestjs/terminus (health), prom-client (metrics)
- **Testing:** Jest (131 tests)
- **Infra:** Docker multi-stage + GitHub Actions CI/CD

### Módulos (12)
Auth, Clients, Providers, Services, Bookings, Reviews, Prisma, Health, Metrics, SMS, Addresses, Admin
- Cada módulo: Controller → Service → DTOs → Prisma

### Endpoints clave
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/profile`
- CRUD: `/clients`, `/providers`, `/services`, `/bookings`
- `GET /health`, `GET /ready`, `GET /metrics`

## Frontend Mobile
- **Runtime:** Expo SDK 53 + TypeScript
- **Routing:** Expo Router v4 (file-based)
- **Styling:** NativeWind v4 (Tailwind CSS)
- **State:** Zustand v5 (auth, theme, toast, loading stores)
- **Data Fetching:** TanStack React Query v5 + Axios
- **Forms:** React Hook Form + Zod
- **Storage:** react-native-mmkv

### Design System (`src/components/ui/`)
21 componentes primitivos con NativeWind v4 + CVA + tailwind-merge:

`Avatar`, `Badge`, `BottomSheet`, `Button`, `Card`, `Chip`, `DatePicker`, `EmptyState`, `ErrorBoundary`, `Header`, `Input`, `Loader`, `LoadingOverlay`, `Modal`, `OTPInput`, `SearchBar`, `Select`, `Skeleton`/`SkeletonGroup`, `Spinner`, `Toast`/`ToastProvider`

### Estructura `src/`
```
src/
├── app/          # Expo Router layouts (root, auth, tabs, 404)
├── components/ui/ # Design System (21 componentes)
├── features/auth/ # AuthGuard
├── hooks/        # useAuth, useColorScheme, useToast
├── lib/          # query-client, mmkv, fonts
├── services/     # api.ts (Axios) + auth, sms, cities, services, providers, clients, bookings
├── store/        # auth-store, theme-store, toast-store, loading-store
├── types/        # api.ts, auth.ts
├── theme/        # colors, typography, spacing
├── utils/        # validation (Zod), formatters, constants
└── assets/       # app icons, splash, fonts
```

### Servicios API (7 módulos)
auth, sms, cities, services, providers, clients, bookings — con interceptors JWT + refresh automático

## Frontend Admin
- Vite + React + react-router
