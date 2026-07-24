# Roadmap — Cleaning App

> Plan de desarrollo del proyecto. 20 fases organizadas por dependencia y valor de negocio.
> 
> **Estado actual:** 131 tests pasando, backend con 7 módulos + observabilidad + Dockerización + CI/CD (GitHub Actions), frontends en scaffold.
> 
> **Leyenda:** ✅ Completada | 🔜 En progreso | 📝 Pendiente

---

## Fase 0: Fundación del Proyecto ✅

**Objetivo:** Establecer la base técnica del proyecto: backend funcional con todos los módulos core y documentación completa.

**Descripción:** 
Configuración completa del backend NestJS con Prisma, PostgreSQL (Neon), Twilio, Swagger, validación global, manejo de errores y 6 módulos funcionales (Cities, Services, Providers, Clients, Bookings, SMS/OTP). Se crean 111 tests unitarios y la documentación del proyecto en `.claude/`.

**Entregables:**
- Backend NestJS v11 funcional en puerto 3000
- Prisma schema con 8 modelos (City, Client, Provider, Service, ProviderService, Booking, Review, Otp)
- 6 módulos feature completos con CRUD y Swagger
- Módulo SMS/OTP con Twilio y rate limiting
- Global ValidationPipe, AllExceptionsFilter, CORS configurable
- 111 tests unitarios pasando
- Documentación completa en `.claude/` (12 archivos)

**Archivos afectados:**
- `backend/src/**` — Todos los archivos del backend
- `backend/prisma/schema.prisma` — Schema completo
- `backend/.env` — Variables de entorno
- `backend/jest.config.js` — Configuración de tests
- `backend/package.json` — Dependencias y scripts
- `backend/tsconfig.json` — TypeScript config
- `.claude/**` — Documentación del proyecto

**Criterios de aceptación:**
- [ ] `npm run build` compila sin errores
- [ ] `npm test` ejecuta 111+ tests sin fallos
- [ ] Servidor inicia en puerto 3000
- [ ] Swagger UI accesible en `/api/docs`
- [ ] Todos los endpoints CRUD responden correctamente
- [ ] OTP se envía por consola cuando Twilio no está configurado
- [ ] Errores 404/409/400 retornan formato consistente

**Checklist:**
- [x] NestJS scaffolding
- [x] Prisma schema con todos los modelos
- [x] PrismaModule global
- [x] Global ValidationPipe
- [x] Global AllExceptionsFilter
- [x] Swagger configurado
- [x] CORS configurable
- [x] Cities module (CRUD + tests)
- [x] Services module (CRUD + tests)
- [x] Providers module (CRUD + tests)
- [x] Clients module (CRUD + tests)
- [x] Bookings module (CRUD + tests)
- [x] SMS/OTP module (Twilio + tests)
- [x] Documentación .claude/

**Dependencias:** Ninguna.

**Tiempo estimado:** Proyecto inicial completado.

---

## Fase 1: Autenticación con OTP y JWT ✅

**Objetivo:** Implementar autenticación completa: registro con verificación telefónica, inicio de sesión con JWT, guards de protección de rutas.

**Descripción:**
Crear el módulo Auth que integre el sistema OTP existente con JWT. Los usuarios (clientes y prestadores) se registran verificando su teléfono vía OTP y reciben un token JWT. Se implementan guards para proteger rutas según rol (cliente, prestador, admin).

**Entregables:**
- Módulo `auth/` con controller, service, DTOs
- Endpoint `POST /auth/register` (verifica OTP + crea usuario + emite JWT)
- Endpoint `POST /auth/login` (verifica OTP + emite JWT)
- Endpoint `POST /auth/refresh` (renueva token)
- JwtAuthGuard para proteger rutas
- RolesGuard para autorización por rol
- Decorador `@CurrentUser()` para extraer usuario del token
- Tests unitarios del módulo auth
- Actualización de Swagger con esquemas de auth

**Archivos afectados:**
- `backend/src/auth/auth.module.ts` (nuevo)
- `backend/src/auth/auth.service.ts` (nuevo)
- `backend/src/auth/auth.controller.ts` (nuevo)
- `backend/src/auth/dto/register.dto.ts` (nuevo)
- `backend/src/auth/dto/login.dto.ts` (nuevo)
- `backend/src/auth/dto/refresh.dto.ts` (nuevo)
- `backend/src/auth/guards/jwt-auth.guard.ts` (nuevo)
- `backend/src/auth/guards/roles.guard.ts` (nuevo)
- `backend/src/auth/decorators/current-user.decorator.ts` (nuevo)
- `backend/src/auth/decorators/roles.decorator.ts` (nuevo)
- `backend/src/auth/auth.service.spec.ts` (nuevo)
- `backend/src/auth/auth.controller.spec.ts` (nuevo)
- `backend/src/app.module.ts` (agregar AuthModule)
- `backend/prisma/schema.prisma` (agregar campo role a Client y Provider)
- `backend/src/common/guards/` (si aplica)

**Criterios de aceptación:**
- [x] Registro con teléfono + OTP crea usuario y retorna JWT
- [x] Login con teléfono + OTP retorna JWT
- [x] Token JWT incluye userId y role en payload
- [x] JwtAuthGuard protege rutas y retorna 401 sin token
- [x] RolesGuard restringe acceso por rol (admin vs cliente vs prestador)
- [x] Refresh token funciona correctamente (rotación)
- [x] Tests unitarios del módulo auth pasan (20 tests)
- [x] `npm run build` compila sin errores
- [x] `npm test` ejecuta todos los tests sin fallos (131 tests)

**Checklist:**
- [x] Agregar modelos `User` y `RefreshToken` a schema.prisma
- [x] Ejecutar `prisma generate`
- [x] Implementar AuthService (register, login, refresh, logout, getProfile)
- [x] Implementar JwtStrategy (Passport)
- [x] Implementar JwtAuthGuard
- [x] Implementar RolesGuard
- [x] Implementar @CurrentUser decorator
- [x] Implementar AuthController con Swagger
- [x] Implementar AuthModule y registrar en AppModule
- [x] Escribir tests del servicio (14 tests)
- [x] Escribir tests del controlador (6 tests)
- [x] Verificar compilación y tests (131 total, todos pasan)

**Dependencias:**
- Fase 0 (módulo SMS/OTP funcional)
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` (ya instalados)

**Tiempo estimado:** 2-3 días.

---

## Fase 2: Módulo de Reseñas (Reviews) 📝

**Objetivo:** Implementar sistema de reseñas y calificaciones vinculado a reservas completadas.

**Descripción:**
Crear el módulo Reviews que permita a los clientes calificar y comentar los servicios recibidos. Cada reserva completada puede tener exactamente una reseña. Las calificaciones se agregan al perfil del prestador (rating promedio, total de reseñas).

**Entregables:**
- Módulo `reviews/` con CRUD completo
- Endpoint `POST /reviews` (crear reseña sobre booking COMPLETED)
- Endpoint `GET /reviews/provider/:providerId` (listar reseñas de un prestador)
- Validación: una reseña por booking, solo en COMPLETED
- Actualización automática de Provider.rating y Provider.reviews al crear/eliminar reseña
- Tests unitarios del módulo

**Archivos afectados:**
- `backend/src/reviews/reviews.module.ts` (nuevo)
- `backend/src/reviews/reviews.service.ts` (nuevo)
- `backend/src/reviews/reviews.controller.ts` (nuevo)
- `backend/src/reviews/dto/create-review.dto.ts` (nuevo)
- `backend/src/reviews/dto/update-review.dto.ts` (nuevo)
- `backend/src/reviews/dto/query-review.dto.ts` (nuevo)
- `backend/src/reviews/reviews.service.spec.ts` (nuevo)
- `backend/src/reviews/reviews.controller.spec.ts` (nuevo)
- `backend/src/app.module.ts` (agregar ReviewsModule)

**Criterios de aceptación:**
- [ ] Solo se puede reseñar un booking en estado COMPLETED
- [ ] Solo una reseña por booking
- [ ] Calificación entre 1 y 5 (entero)
- [ ] Al crear reseña, se actualiza rating promedio del provider
- [ ] Al eliminar reseña, se recalcula rating del provider
- [ ] Listar reseñas por provider con paginación
- [ ] Tests unitarios pasan

**Checklist:**
- [ ] Implementar CreateReviewDto con validación
- [ ] Implementar ReviewsService (crear con validación de booking, listar por provider, eliminar)
- [ ] Implementar lógica de actualización de rating en Provider
- [ ] Implementar ReviewsController con Swagger
- [ ] Implementar ReviewsModule
- [ ] Escribir tests
- [ ] Verificar compilación y tests

**Dependencias:**
- Fase 0 (modelo Review ya existe en schema)
- Fase 1 (autenticación para proteger endpoints)

**Tiempo estimado:** 1-2 días.

---

## Fase 3: Asignación Servicio-Prestador (ProviderService) 📝

**Objetivo:** Permitir que los prestadores definan qué servicios ofrecen y a qué precio.

**Descripción:**
Crear el módulo ProviderService que gestione la relación muchos-a-muchos entre prestadores y servicios. Cada prestador puede ofrecer múltiples servicios, y cada servicio puede ser ofrecido por múltiples prestadores, cada uno con su propio precio.

**Entregables:**
- Endpoints CRUD para ProviderService (asignar servicio a provider con precio)
- Endpoint `GET /providers/:id/services` (servicios ofrecidos por un provider)
- Endpoint `GET /services/:id/providers` (providers que ofrecen un servicio)
- Validación: precio mínimo, provider y service deben existir
- Tests unitarios

**Archivos afectados:**
- `backend/src/provider-services/provider-services.module.ts` (nuevo)
- `backend/src/provider-services/provider-services.service.ts` (nuevo)
- `backend/src/provider-services/provider-services.controller.ts` (nuevo)
- `backend/src/provider-services/dto/create-provider-service.dto.ts` (nuevo)
- `backend/src/provider-services/dto/update-provider-service.dto.ts` (nuevo)
- `backend/src/provider-services/provider-services.service.spec.ts` (nuevo)
- `backend/src/provider-services/provider-services.controller.spec.ts` (nuevo)
- `backend/src/app.module.ts` (agregar módulo)

**Criterios de aceptación:**
- [ ] Asignar servicio a provider con precio válido (> 0)
- [ ] Un provider no puede tener el mismo servicio dos veces
- [ ] Listar todos los servicios de un provider
- [ ] Listar todos los providers que ofrecen un servicio
- [ ] Actualizar precio de un servicio asignado
- [ ] Eliminar asignación
- [ ] Tests pasan

**Checklist:**
- [ ] Implementar DTOs
- [ ] Implementar servicio (CRUD sobre modelo ProviderService existente)
- [ ] Implementar controlador con Swagger
- [ ] Implementar módulo
- [ ] Escribir tests
- [ ] Verificar compilación

**Dependencias:**
- Fase 0 (modelo ProviderService ya existe)

**Tiempo estimado:** 1 día.

---

## Fase 4: Ciclo Completo de Reservas (Estados y Acciones) 📝

**Objetivo:** Implementar el flujo completo de estados de reserva con acciones de aceptación, inicio y finalización.

**Descripción:**
Extender el módulo Bookings para que los prestadores puedan aceptar/confirmar reservas, marcar inicio del servicio y marcar finalización. Implementar validación de transiciones de estado (no se puede saltar de PENDING a COMPLETED).

**Entregables:**
- Endpoint `PATCH /bookings/:id/confirm` (prestador acepta)
- Endpoint `PATCH /bookings/:id/start` (prestador inicia servicio)
- Endpoint `PATCH /bookings/:id/complete` (prestador completa)
- Endpoint `PATCH /bookings/:id/cancel` (cliente o prestador cancela)
- Validación de transiciones de estado
- Notificaciones SMS en cada cambio de estado
- Tests actualizados

**Archivos afectados:**
- `backend/src/bookings/bookings.service.ts` (agregar métodos de transición)
- `backend/src/bookings/bookings.controller.ts` (agregar endpoints)
- `backend/src/bookings/dto/update-booking.dto.ts` (actualizar)
- `backend/src/bookings/bookings.service.spec.ts` (actualizar)
- `backend/src/bookings/bookings.controller.spec.ts` (actualizar)

**Criterios de aceptación:**
- [ ] PENDING → CONFIRMED (solo prestador)
- [ ] CONFIRMED → IN_PROGRESS (solo prestador)
- [ ] IN_PROGRESS → COMPLETED (solo prestador)
- [ ] PENDING o CONFIRMED → CANCELLED (cliente o prestador)
- [ ] No se permiten transiciones inválidas (ej: PENDING → COMPLETED)
- [ ] Se envía SMS en cada cambio de estado
- [ ] Tests pasan

**Checklist:**
- [ ] Definir máquina de estados (allowed transitions map)
- [ ] Implementar método transitionState en servicio
- [ ] Implementar endpoints específicos en controlador
- [ ] Integrar SMS en transiciones
- [ ] Actualizar tests
- [ ] Verificar compilación

**Dependencias:**
- Fase 0 (módulo Bookings base funcional)
- Fase 1 (autenticación para identificar quién ejecuta la acción)

**Tiempo estimado:** 2 días.

---

## Fase 5: Búsqueda y Filtros Avanzados 📝

**Objetivo:** Mejorar los endpoints de listado con paginación, ordenamiento configurable y filtros combinados.

**Descripción:**
Agregar paginación (`page`, `limit`) a todos los endpoints GET. Implementar ordenamiento configurable (`sortBy`, `sortOrder`). Agregar filtros de rango de fechas para bookings y ratings para providers.

**Entregables:**
- Paginación: `?page=1&limit=10` con metadatos `{ data, total, page, limit, totalPages }`
- Ordenamiento: `?sortBy=name&sortOrder=asc`
- Filtro de fechas en bookings: `?startDate=&endDate=`
- Filtro de rating en providers: `?minRating=`
- DTO genérico de paginación reutilizable
- Tests actualizados

**Archivos afectados:**
- `backend/src/common/dto/pagination.dto.ts` (nuevo — DTO genérico)
- `backend/src/common/interfaces/pagination.interface.ts` (nuevo)
- `backend/src/providers/providers.service.ts` (agregar paginación)
- `backend/src/providers/dto/query-provider.dto.ts` (agregar minRating)
- `backend/src/bookings/bookings.service.ts` (agregar paginación + fechas)
- `backend/src/bookings/dto/query-booking.dto.ts` (agregar fechas)
- `backend/src/cities/cities.service.ts` (agregar paginación)
- `backend/src/services/services.service.ts` (agregar paginación)
- `backend/src/clients/clients.service.ts` (agregar paginación)
- Tests de todos los módulos afectados

**Criterios de aceptación:**
- [ ] Todos los endpoints GET soportan `?page=&limit=`
- [ ] La respuesta incluye metadatos de paginación
- [ ] Ordenamiento configurable por cualquier campo
- [ ] Filtro de fechas funciona correctamente
- [ ] `minRating` filtra providers con rating >= valor
- [ ] Tests pasan

**Checklist:**
- [ ] Crear PaginationDto y PaginatedResponse interface
- [ ] Crear helper de paginación en servicio
- [ ] Actualizar cada servicio para soportar paginación
- [ ] Agregar filtros de fecha en bookings
- [ ] Agregar filtro de rating en providers
- [ ] Actualizar todos los tests
- [ ] Verificar compilación

**Dependencias:**
- Fase 0 (módulos base funcionales)

**Tiempo estimado:** 2-3 días.

---

## Fase 6: Frontend Mobile — Proyecto y Navegación 📝

**Objetivo:** Configurar el proyecto Expo con NativeWind, React Navigation y la estructura base de la app.

**Descripción:**
Inicializar el proyecto frontend-mobile con Expo Router (file-based routing), NativeWind para estilos, React Query y Zustand. Configurar la navegación con tabs (Home, Bookings, Profile) y stack (Auth screens). Crear la estructura de carpetas y componentes base.

**Entregables:**
- Expo Router configurado con layouts (auth, tabs)
- NativeWind instalado y configurado (tailwind.config.js)
- React Query configurado con QueryClientProvider
- Zustand store base para auth
- Componentes UI base: Button, Input, Card, Badge, Spinner, EmptyState
- Cliente HTTP base (api.ts con interceptors, manejo de errores)
- Pantallas placeholder (Login, Home, Bookings, Profile)
- Temas y constantes (colores, tipografía, spacing)

**Archivos afectados:**
- `frontend-mobile/app/_layout.tsx` (nuevo)
- `frontend-mobile/app/(auth)/_layout.tsx` (nuevo)
- `frontend-mobile/app/(auth)/login.tsx` (nuevo)
- `frontend-mobile/app/(auth)/verify-otp.tsx` (nuevo)
- `frontend-mobile/app/(tabs)/_layout.tsx` (nuevo)
- `frontend-mobile/app/(tabs)/index.tsx` (nuevo — Home)
- `frontend-mobile/app/(tabs)/bookings.tsx` (nuevo)
- `frontend-mobile/app/(tabs)/profile.tsx` (nuevo)
- `frontend-mobile/src/components/ui/Button.tsx` (nuevo)
- `frontend-mobile/src/components/ui/Input.tsx` (nuevo)
- `frontend-mobile/src/components/ui/Card.tsx` (nuevo)
- `frontend-mobile/src/components/ui/Badge.tsx` (nuevo)
- `frontend-mobile/src/components/ui/Spinner.tsx` (nuevo)
- `frontend-mobile/src/components/ui/EmptyState.tsx` (nuevo)
- `frontend-mobile/src/services/api.ts` (nuevo)
- `frontend-mobile/src/hooks/useAuth.ts` (nuevo)
- `frontend-mobile/src/stores/authStore.ts` (nuevo)
- `frontend-mobile/src/constants/theme.ts` (nuevo)
- `frontend-mobile/tailwind.config.js` (nuevo)
- `frontend-mobile/package.json` (actualizar dependencias)

**Criterios de aceptación:**
- [ ] App inicia con Expo sin errores
- [ ] NativeWind funciona (clases Tailwind se renderizan)
- [ ] Navegación funciona (auth flow → tabs)
- [ ] Componentes UI base se renderizan correctamente
- [ ] Cliente HTTP hace peticiones al backend
- [ ] Estructura de carpetas sigue Feature First

**Checklist:**
- [ ] Instalar y configurar NativeWind
- [ ] Configurar Expo Router
- [ ] Crear layouts (auth, tabs)
- [ ] Crear componentes UI base
- [ ] Configurar React Query + provider
- [ ] Configurar Zustand + auth store
- [ ] Crear api.ts base
- [ ] Crear pantallas placeholder
- [ ] Configurar tema y constantes

**Dependencias:**
- Fase 0 (backend funcional)

**Tiempo estimado:** 3-4 días.

---

## Fase 7: Frontend Mobile — Autenticación 📝

**Objetivo:** Implementar el flujo completo de autenticación en la app móvil.

**Descripción:**
Conexión del frontend mobile con el backend de autenticación. Pantallas de login (ingreso de teléfono), verificación OTP y manejo de sesión. Protección de rutas: redirect a login si no hay token.

**Entregables:**
- Pantalla de Login (ingreso de teléfono con validación de formato)
- Pantalla de VerifyOTP (ingreso de código de 6 dígitos)
- Auth store con persistencia (token guardado localmente)
- API service para auth (register, login, refresh)
- Protección de rutas (redirect si no autenticado)
- Manejo de errores (OTP incorrecto, expirado, rate limit)
- Auto-login si token persistido es válido

**Archivos afectados:**
- `frontend-mobile/app/(auth)/login.tsx` (implementar)
- `frontend-mobile/app/(auth)/verify-otp.tsx` (implementar)
- `frontend-mobile/app/(tabs)/_layout.tsx` (agregar protección de rutas)
- `frontend-mobile/src/services/api.ts` (agregar interceptors de auth)
- `frontend-mobile/src/services/auth.ts` (nuevo)
- `frontend-mobile/src/hooks/useAuth.ts` (implementar)
- `frontend-mobile/src/stores/authStore.ts` (agregar persistencia)

**Criterios de aceptación:**
- [ ] Ingreso de teléfono con formato +57...
- [ ] Botón "Enviar código" llama a POST /sms/otp/send
- [ ] Pantalla de verificación con 6 inputs
- [ ] Código correcto → navega a Home
- [ ] Código incorrecto → muestra error, permite reintentar
- [ ] 5 intentos fallidos → muestra "solicite nuevo código"
- [ ] Token persistido → auto-login al abrir la app
- [ ] Sin token → redirect a login

**Checklist:**
- [ ] Implementar pantalla de login
- [ ] Implementar pantalla de verify OTP
- [ ] Implementar auth store con persistencia
- [ ] Implementar auth service
- [ ] Implementar protección de rutas
- [ ] Manejar errores de OTP
- [ ] Probar flujo completo

**Dependencias:**
- Fase 1 (backend auth)
- Fase 6 (proyecto mobile base)

**Tiempo estimado:** 2-3 días.

---

## Fase 8: Frontend Mobile — Home y Catálogo de Servicios 📝

**Objetivo:** Implementar la pantalla principal con catálogo de servicios y exploración.

**Descripción:**
Pantalla Home con lista de servicios disponibles, filtro por tipo, búsqueda por nombre. Al seleccionar un servicio, mostrar detalle con descripción, duración, precio y lista de prestadores disponibles con calificación.

**Entregables:**
- Pantalla Home con lista de servicios
- Búsqueda por nombre (con debounce)
- Filtro por tipo de servicio (GENERAL, DEEP, CARPET, WINDOW, OFFICE)
- Pantalla de detalle de servicio
- Lista de prestadores que ofrecen el servicio (con calificación)
- Perfil público del prestador (nombre, rating, reseñas)
- Componentes: ServiceCard, ProviderCard, StarRating, FilterBar

**Archivos afectados:**
- `frontend-mobile/app/(tabs)/index.tsx` (implementar Home)
- `frontend-mobile/app/service/[id].tsx` (nuevo — detalle servicio)
- `frontend-mobile/app/provider/[id].tsx` (nuevo — perfil prestador)
- `frontend-mobile/src/services/services.ts` (nuevo)
- `frontend-mobile/src/services/providers.ts` (nuevo)
- `frontend-mobile/src/hooks/useServices.ts` (nuevo)
- `frontend-mobile/src/hooks/useProviders.ts` (nuevo)
- `frontend-mobile/src/components/ServiceCard.tsx` (nuevo)
- `frontend-mobile/src/components/ProviderCard.tsx` (nuevo)
- `frontend-mobile/src/components/StarRating.tsx` (nuevo)
- `frontend-mobile/src/components/FilterBar.tsx` (nuevo)

**Criterios de aceptación:**
- [ ] Home carga lista de servicios desde API
- [ ] Búsqueda por nombre funciona con debounce (300ms)
- [ ] Filtro por tipo funciona
- [ ] Al seleccionar servicio, navega a detalle
- [ ] Detalle muestra: nombre, descripción, duración, tipo
- [ ] Detalle lista prestadores con nombre, calificación, precio
- [ ] Perfil de prestador muestra reseñas
- [ ] Estados de carga y error funcionan

**Checklist:**
- [ ] Implementar service hooks + API calls
- [ ] Implementar provider hooks + API calls
- [ ] Implementar pantalla Home con búsqueda y filtros
- [ ] Implementar pantalla de detalle de servicio
- [ ] Implementar pantalla de perfil de prestador
- [ ] Crear componentes UI necesarios
- [ ] Manejar estados de carga y error

**Dependencias:**
- Fase 6 (proyecto mobile base)
- Fase 7 (autenticación mobile)

**Tiempo estimado:** 3-4 días.

---

## Fase 9: Frontend Mobile — Flujo de Reserva 📝

**Objetivo:** Implementar el flujo completo de creación de reserva desde la app móvil.

**Descripción:**
Pantallas para crear una reserva: seleccionar fecha y hora (calendario), ingresar dirección, confirmar datos y crear la reserva. Mostrar confirmación y detalle de la reserva creada.

**Entregables:**
- Pantalla de selección de fecha y hora (date/time picker)
- Pantalla de ingreso de dirección
- Pantalla de confirmación (resumen: servicio, prestador, fecha, dirección, precio total)
- Endpoint de creación de reserva desde mobile
- Pantalla de confirmación/éxito
- Pantalla de detalle de reserva
- Estados de carga y error en cada paso

**Archivos afectados:**
- `frontend-mobile/app/booking/new.tsx` (nuevo — crear reserva)
- `frontend-mobile/app/booking/[id].tsx` (nuevo — detalle reserva)
- `frontend-mobile/app/booking/confirm.tsx` (nuevo — confirmación)
- `frontend-mobile/src/services/bookings.ts` (nuevo)
- `frontend-mobile/src/hooks/useBookings.ts` (nuevo)
- `frontend-mobile/src/components/DateTimePicker.tsx` (nuevo)
- `frontend-mobile/src/components/BookingCard.tsx` (nuevo)
- `frontend-mobile/src/components/BookingSteps.tsx` (nuevo — indicador de pasos)

**Criterios de aceptación:**
- [ ] Seleccionar fecha y hora (mínimo 2 horas desde ahora)
- [ ] Ingresar dirección con validación
- [ ] Resumen muestra todos los datos antes de confirmar
- [ ] Crear reserva llama a POST /bookings
- [ ] Éxito muestra pantalla de confirmación con datos de la reserva
- [ ] Navegación hacia atrás en cada paso
- [ ] Estados de carga y error en cada paso

**Checklist:**
- [ ] Crear API service de bookings
- [ ] Crear hooks de bookings
- [ ] Implementar date/time picker
- [ ] Implementar formulario de dirección
- [ ] Implementar pantalla de confirmación
- [ ] Implementar pantalla de éxito
- [ ] Implementar pantalla de detalle
- [ ] Manejar estados de carga/error

**Dependencias:**
- Fase 6 (proyecto mobile base)
- Fase 8 (catálogo de servicios)

**Tiempo estimado:** 3-4 días.

---

## Fase 10: Frontend Mobile — Mis Reservas y Perfil 📝

**Objetivo:** Implementar la sección de historial de reservas y perfil de usuario.

**Descripción:**
Pestaña de Bookings con lista de reservas del cliente (futuras y pasadas), filtro por estado, detalle de cada reserva. Pestaña de Profile con datos del usuario, opción de cerrar sesión.

**Entregables:**
- Lista de reservas del cliente (ordenadas por fecha, descendente)
- Filtro por estado (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
- Detalle de reserva con toda la información
- Acción de cancelar reserva (si está en PENDING o CONFIRMED)
- Perfil de usuario (nombre, teléfono, email)
- Cerrar sesión
- Reseñar servicio completado (rating + comentario)

**Archivos afectados:**
- `frontend-mobile/app/(tabs)/bookings.tsx` (implementar)
- `frontend-mobile/app/(tabs)/profile.tsx` (implementar)
- `frontend-mobile/app/booking/[id].tsx` (mejorar detalle)
- `frontend-mobile/app/review/new.tsx` (nuevo — crear reseña)
- `frontend-mobile/src/services/reviews.ts` (nuevo)
- `frontend-mobile/src/hooks/useReviews.ts` (nuevo)
- `frontend-mobile/src/services/clients.ts` (nuevo)
- `frontend-mobile/src/components/BookingStatusBadge.tsx` (nuevo)
- `frontend-mobile/src/components/ReviewForm.tsx` (nuevo)

**Criterios de aceptación:**
- [ ] Lista de reservas carga correctamente
- [ ] Filtro por estado funciona
- [ ] Detalle de reserva muestra toda la info
- [ ] Cancelar reserva funciona (con confirmación)
- [ ] Reseñar servicio completado funciona
- [ ] Perfil muestra datos del usuario
- [ ] Cerrar sesión limpia store y redirige a login

**Checklist:**
- [ ] Implementar API service de clients y reviews
- [ ] Implementar hooks
- [ ] Implementar lista de reservas con filtros
- [ ] Implementar detalle con acciones
- [ ] Implementar formulario de reseña
- [ ] Implementar perfil de usuario
- [ ] Implementar cierre de sesión

**Dependencias:**
- Fase 2 (backend reviews)
- Fase 4 (backend ciclo de reservas)
- Fase 7 (autenticación mobile)

**Tiempo estimado:** 3-4 días.

---

## Fase 11: Notificaciones Push (Mobile) 📝

**Objetivo:** Implementar notificaciones push para eventos importantes del ciclo de reserva.

**Descripción:**
Integrar notificaciones push vía Expo Notifications. Enviar notificaciones cuando: reserva creada, reserva confirmada, servicio iniciado, servicio completado, reserva cancelada, recordatorio 24h antes.

**Entregables:**
- Configuración de Expo Notifications (permissions, tokens)
- Servicio de registro de push tokens
- Envío de notificaciones desde el backend (vía Expo Push API)
- Notificaciones locales para recordatorios
- Manejo de tap en notificación (navegar a detalle de reserva)

**Archivos afectados:**
- `frontend-mobile/src/services/notifications.ts` (nuevo)
- `frontend-mobile/src/hooks/useNotifications.ts` (nuevo)
- `frontend-mobile/app/_layout.tsx` (registrar push token)
- `backend/src/notifications/notifications.service.ts` (nuevo)
- `backend/src/notifications/notifications.module.ts` (nuevo)

**Criterios de aceptación:**
- [ ] App solicita permiso de notificaciones
- [ ] Push token se registra en el backend
- [ ] Al crear reserva, se envía notificación al prestador
- [ ] Al confirmar reserva, se envía notificación al cliente
- [ ] Al completar, se envía notificación para reseñar
- [ ] Tap en notificación navega al detalle de la reserva

**Checklist:**
- [ ] Configurar Expo Notifications
- [ ] Implementar registro de push tokens
- [ ] Implementar backend de notificaciones
- [ ] Integrar en el flujo de reservas
- [ ] Probar notificaciones en dispositivo real

**Dependencias:**
- Fase 6 (proyecto mobile base)
- Fase 4 (backend ciclo de reservas)

**Tiempo estimado:** 3-4 días.

---

## Fase 12: Frontend Admin — Proyecto y Dashboard 📝

**Objetivo:** Configurar el proyecto admin con React, Vite, React Query, Zustand y el dashboard principal.

**Descripción:**
Inicializar el frontend-admin con React 19 + Vite 6. Configurar React Query, Zustand, router (React Router v7), y crear el layout base con sidebar, header y dashboard con métricas.

**Entregables:**
- Vite + React configurado
- React Router con rutas protegidas
- Layout con sidebar + header
- Componentes base: Table, Modal, Form, Button, Input, Badge, StatusBadge
- Dashboard con métricas: reservas del día, total clientes, prestadores activos, ingresos
- API service base con interceptors
- Auth store + login screen

**Archivos afectados:**
- `frontend-admin/src/main.tsx` (configurar providers)
- `frontend-admin/src/App.tsx` (router + layout)
- `frontend-admin/src/pages/Dashboard.tsx` (nuevo)
- `frontend-admin/src/pages/Login.tsx` (nuevo)
- `frontend-admin/src/components/layout/Sidebar.tsx` (nuevo)
- `frontend-admin/src/components/layout/Header.tsx` (nuevo)
- `frontend-admin/src/components/ui/Table.tsx` (nuevo)
- `frontend-admin/src/components/ui/Modal.tsx` (nuevo)
- `frontend-admin/src/components/ui/Form.tsx` (nuevo)
- `frontend-admin/src/components/ui/Button.tsx` (nuevo)
- `frontend-admin/src/components/ui/Input.tsx` (nuevo)
- `frontend-admin/src/components/ui/Badge.tsx` (nuevo)
- `frontend-admin/src/components/ui/StatusBadge.tsx` (nuevo)
- `frontend-admin/src/services/api.ts` (nuevo)
- `frontend-admin/src/services/auth.ts` (nuevo)
- `frontend-admin/src/stores/authStore.ts` (nuevo)
- `frontend-admin/src/hooks/useAuth.ts` (nuevo)
- `frontend-admin/src/hooks/useDashboard.ts` (nuevo)

**Criterios de aceptación:**
- [ ] Admin app inicia sin errores
- [ ] Login funciona con backend
- [ ] Dashboard muestra métricas reales desde API
- [ ] Sidebar navega a las secciones
- [ ] Componentes UI base funcionan
- [ ] Layout responsivo

**Checklist:**
- [ ] Configurar Vite + React + TypeScript
- [ ] Configurar React Router
- [ ] Configurar React Query
- [ ] Configurar Zustand
- [ ] Crear layout (sidebar + header)
- [ ] Crear componentes base
- [ ] Implementar login
- [ ] Implementar dashboard
- [ ] Crear API service base

**Dependencias:**
- Fase 1 (backend auth)
- Fase 5 (backend paginación)

**Tiempo estimado:** 4-5 días.

---

## Fase 13: Frontend Admin — CRUD Cities y Services 📝

**Objetivo:** Implementar pantallas de gestión de ciudades y servicios en el admin.

**Descripción:**
Páginas CRUD completas para Cities y Services con tabla, formulario de creación/edición (modal), búsqueda, filtros, paginación y confirmación de eliminación.

**Entregables:**
- Página Cities: tabla con búsqueda, crear, editar, eliminar
- Página Services: tabla con búsqueda, filtro por tipo, crear, editar, eliminar
- ModalForm reutilizable para crear/editar
- ConfirmDialog para eliminar
- Notificaciones de éxito/error (toast)
- Paginación en tablas

**Archivos afectados:**
- `frontend-admin/src/pages/Cities/CityList.tsx` (nuevo)
- `frontend-admin/src/pages/Cities/CityForm.tsx` (nuevo)
- `frontend-admin/src/pages/Services/ServiceList.tsx` (nuevo)
- `frontend-admin/src/pages/Services/ServiceForm.tsx` (nuevo)
- `frontend-admin/src/services/cities.ts` (nuevo)
- `frontend-admin/src/services/services.ts` (nuevo)
- `frontend-admin/src/hooks/useCities.ts` (nuevo)
- `frontend-admin/src/hooks/useServices.ts` (nuevo)
- `frontend-admin/src/components/ui/ConfirmDialog.tsx` (nuevo)
- `frontend-admin/src/components/ui/Toast.tsx` (nuevo)

**Criterios de aceptación:**
- [ ] CRUD completo de ciudades
- [ ] CRUD completo de servicios
- [ ] Búsqueda en tiempo real
- [ ] Filtro por tipo en servicios
- [ ] Paginación funcional
- [ ] Confirmación antes de eliminar
- [ ] Toast de éxito/error después de cada operación

**Checklist:**
- [ ] Crear páginas CRUD Cities
- [ ] Crear páginas CRUD Services
- [ ] Implementar servicios API
- [ ] Implementar hooks
- [ ] Implementar ConfirmDialog
- [ ] Implementar Toast
- [ ] Probar flujo completo

**Dependencias:**
- Fase 12 (admin base)

**Tiempo estimado:** 2-3 días.

---

## Fase 14: Frontend Admin — CRUD Providers y Clients 📝

**Objetivo:** Implementar pantallas de gestión de prestadores y clientes.

**Descripción:**
Páginas CRUD para Providers (con filtros de ciudad y disponibilidad, toggle de disponibilidad) y Clients (con búsqueda). Vista de detalle con información relacionada.

**Entregables:**
- Página Providers: tabla con búsqueda, filtros (ciudad, disponibilidad), crear, editar, eliminar
- Toggle de disponibilidad (isAvailable) inline en la tabla
- Vista de detalle de provider (datos, servicios que ofrece, reseñas)
- Página Clients: tabla con búsqueda, crear, editar, eliminar
- Vista de detalle de cliente (datos, historial de reservas)

**Archivos afectados:**
- `frontend-admin/src/pages/Providers/ProviderList.tsx` (nuevo)
- `frontend-admin/src/pages/Providers/ProviderForm.tsx` (nuevo)
- `frontend-admin/src/pages/Providers/ProviderDetail.tsx` (nuevo)
- `frontend-admin/src/pages/Clients/ClientList.tsx` (nuevo)
- `frontend-admin/src/pages/Clients/ClientForm.tsx` (nuevo)
- `frontend-admin/src/pages/Clients/ClientDetail.tsx` (nuevo)
- `frontend-admin/src/services/providers.ts` (nuevo)
- `frontend-admin/src/services/clients.ts` (nuevo)
- `frontend-admin/src/hooks/useProviders.ts` (nuevo)
- `frontend-admin/src/hooks/useClients.ts` (nuevo)

**Criterios de aceptación:**
- [ ] CRUD completo de providers
- [ ] Filtros combinados (ciudad + disponibilidad + búsqueda)
- [ ] Toggle de disponibilidad inline
- [ ] Detalle de provider muestra servicios y reseñas
- [ ] CRUD completo de clients
- [ ] Detalle de cliente muestra historial de reservas
- [ ] Paginación en ambas tablas

**Checklist:**
- [ ] Crear páginas CRUD Providers
- [ ] Crear páginas CRUD Clients
- [ ] Implementar servicios API
- [ ] Implementar hooks
- [ ] Implementar vistas de detalle
- [ ] Implementar toggle inline
- [ ] Probar flujo completo

**Dependencias:**
- Fase 12 (admin base)

**Tiempo estimado:** 3-4 días.

---

## Fase 15: Frontend Admin — Gestión de Reservas 📝

**Objetivo:** Implementar la gestión completa de reservas en el admin.

**Descripción:**
Página de Bookings con tabla completa, filtros avanzados (estado, cliente, prestador, fechas), capacidad de cambiar estado manualmente y vista de detalle. Acciones de cancelación desde admin.

**Entregables:**
- Página Bookings: tabla con todos los filtros
- Filtros: estado, cliente, prestador, rango de fechas
- Cambio de estado de reserva desde admin
- Detalle de reserva (cliente, prestador, servicio, dirección, historial de estados)
- Acción de cancelar reserva (con motivo)
- Exportación a CSV (funcionalidad básica)

**Archivos afectados:**
- `frontend-admin/src/pages/Bookings/BookingList.tsx` (nuevo)
- `frontend-admin/src/pages/Bookings/BookingDetail.tsx` (nuevo)
- `frontend-admin/src/pages/Bookings/BookingActions.tsx` (nuevo)
- `frontend-admin/src/services/bookings.ts` (nuevo)
- `frontend-admin/src/hooks/useBookings.ts` (nuevo)
- `frontend-admin/src/components/BookingTimeline.tsx` (nuevo — historial visual de estados)

**Criterios de aceptación:**
- [ ] Tabla de reservas con todos los filtros combinados
- [ ] Detalle de reserva con información completa
- [ ] Cambio de estado desde admin
- [ ] Cancelación con motivo
- [ ] Historial visual de cambios de estado
- [ ] Paginación funcional

**Checklist:**
- [ ] Crear página de listado con filtros
- [ ] Crear página de detalle
- [ ] Implementar acciones de cambio de estado
- [ ] Implementar BookingTimeline
- [ ] Crear servicios API y hooks
- [ ] Probar flujo completo

**Dependencias:**
- Fase 4 (backend ciclo de reservas)
- Fase 12 (admin base)

**Tiempo estimado:** 3-4 días.

---

## Fase 16: Panel de Analíticas y Reportes 📝

**Objetivo:** Implementar dashboard avanzado con gráficos y reportes descargables.

**Descripción:**
Agregar gráficos al dashboard (reservas por día/semana/mes, ingresos, distribución de servicios, prestadores top). Tablero de KPIs en tiempo real. Exportación de reportes.

**Entregables:**
- Dashboard con gráficos (Chart.js o Recharts)
- KPIs: reservas hoy, esta semana, este mes
- Ingresos: total, promedio por reserva
- Top prestadores por calificación y volumen
- Distribución de servicios por tipo
- Reporte descargable (PDF/CSV)

**Archivos afectados:**
- `frontend-admin/src/pages/Dashboard.tsx` (mejorar con gráficos)
- `frontend-admin/src/hooks/useDashboard.ts` (agregar más queries)
- `backend/src/dashboard/dashboard.service.ts` (nuevo — agregación de datos)
- `backend/src/dashboard/dashboard.controller.ts` (nuevo)
- `backend/src/dashboard/dashboard.module.ts` (nuevo)

**Criterios de aceptación:**
- [ ] Dashboard muestra KPIs correctos
- [ ] Gráficos se renderizan sin errores
- [ ] Datos vienen de endpoints de agregación del backend
- [ ] Reporte descargable contiene datos correctos
- [ ] Dashboard se actualiza periódicamente

**Checklist:**
- [ ] Implementar endpoint de métricas en backend
- [ ] Instalar librería de gráficos
- [ ] Implementar gráficos en dashboard
- [ ] Implementar exportación de reportes
- [ ] Probar con datos reales

**Dependencias:**
- Fase 12 (admin base)
- Fase 15 (bookings admin)

**Tiempo estimado:** 3-4 días.

---

## Fase 17: Pagos — Integración con Pasarela 📝

**Objetivo:** Integrar pagos en línea para el flujo de reservas.

**Descripción:**
Integrar una pasarela de pagos (Mercado Pago o Stripe) para que los clientes paguen los servicios al crear la reserva. Implementar liberación de pago al completar el servicio. Manejo de reembolsos por cancelación.

**Entregables:**
- Integración con pasarela de pagos (Mercado Pago recomendado para LatAm)
- Endpoint para crear intención de pago
- Webhook para confirmar pago
- Liberación de pago al prestador cuando COMPLETED
- Reembolso automático si CANCELLED
- Estado de pago en la reserva
- Tests de integración

**Archivos afectados:**
- `backend/src/payments/payments.module.ts` (nuevo)
- `backend/src/payments/payments.service.ts` (nuevo)
- `backend/src/payments/payments.controller.ts` (nuevo)
- `backend/src/payments/dto/create-payment.dto.ts` (nuevo)
- `backend/src/payments/webhooks/payments.webhook.ts` (nuevo)
- `backend/prisma/schema.prisma` (agregar campos de pago a Booking)
- `backend/src/app.module.ts` (agregar PaymentsModule)
- `frontend-mobile/src/services/payments.ts` (nuevo)
- `frontend-mobile/src/components/PaymentSheet.tsx` (nuevo)

**Criterios de aceptación:**
- [ ] Cliente puede pagar con tarjeta de crédito/débito
- [ ] Pago se confirma vía webhook
- [ ] Booking no pasa a IN_PROGRESS sin pago confirmado
- [ ] Al completar servicio, el pago se libera al prestador
- [ ] Al cancelar, se procesa reembolso
- [ ] Estados de pago se reflejan en booking

**Checklist:**
- [ ] Elegir pasarela de pagos
- [ ] Configurar cuenta y credenciales
- [ ] Implementar backend payments
- [ ] Implementar webhooks
- [ ] Integrar con booking flow
- [ ] Probar flujo completo de pago

**Dependencias:**
- Fase 4 (backend ciclo de reservas)
- Fase 9 (mobile flujo de reserva)

**Tiempo estimado:** 5-7 días.

---

## Fase 18: Despliegue y DevOps 📝

**Objetivo:** Configurar el pipeline de CI/CD y desplegar los tres proyectos a producción.

**Descripción:**
Configurar GitHub Actions para CI (tests + build), desplegar backend en Railway/Render, frontend admin en Vercel/Cloudflare, frontend mobile en EAS Build. Configurar dominio, SSL, monitoreo.

**Entregables:**
- GitHub Actions: CI pipeline (test, build)
- GitHub Actions: CD pipeline (deploy)
- Backend desplegado en Railway/Render
- Frontend admin desplegado en Vercel/Cloudflare
- Frontend mobile build en EAS
- Dominio personalizado con SSL
- Monitoreo básico (uptime, errores)
- Documentación de despliegue

**Archivos afectados:**
- `.github/workflows/ci.yml` (nuevo)
- `.github/workflows/deploy-backend.yml` (nuevo)
- `.github/workflows/deploy-admin.yml` (nuevo)
- `backend/Dockerfile` (nuevo)
- `frontend-admin/Dockerfile` (nuevo)
- `frontend-admin/vercel.json` (nuevo)
- `.claude/DEPLOYMENT.md` (actualizar)

**Criterios de aceptación:**
- [ ] CI ejecuta tests automáticamente en cada PR
- [ ] CD despliega automáticamente al hacer merge a main
- [ ] Backend accesible desde internet con HTTPS
- [ ] Admin accesible desde internet con HTTPS
- [ ] Mobile build se genera correctamente
- [ ] Monitoreo reporta estado del servidor

**Checklist:**
- [x] Configurar GitHub Actions (ci.yml + deploy.yml)
- [x] Crear Dockerfile para backend (multi-stage + dev)
- [x] Crear docker-compose.yml + dev + prod profiles
- [x] Crear scripts de healthcheck y helpers
- [x] Crear .env.example
- [x] Actualizar DEPLOYMENT.md con Docker + CI/CD real
- [ ] Configurar Railway/Render
- [ ] Configurar Vercel/Cloudflare
- [ ] Configurar EAS Build
- [ ] Configurar dominio y SSL
- [ ] Configurar monitoreo

**Dependencias:**
- Fase 0 a 17 (todo el desarrollo completado)

**Tiempo estimado:** 4-5 días.

---

## Fase 19: Pruebas de Integración y E2E 📝

**Objetivo:** Implementar pruebas de integración y end-to-end para garantizar calidad.

**Descripción:**
Crear tests de integración que prueben el backend con una base de datos de prueba (Neon branch). Crear tests E2E que cubran flujos completos (registro → login → crear reserva → completar → reseñar). Implementar en CI.

**Entregables:**
- Tests de integración del backend (SuperTest + base de datos de prueba)
- Tests E2E de flujos críticos
- Script de setup de base de datos de prueba
- Integración en CI
- Reporte de cobertura

**Archivos afectados:**
- `backend/test/app.e2e-spec.ts` (nuevo — test E2E principal)
- `backend/test/auth.e2e-spec.ts` (nuevo)
- `backend/test/booking-flow.e2e-spec.ts` (nuevo)
- `backend/test/jest-e2e.json` (nuevo)
- `backend/package.json` (agregar script test:e2e)
- `.github/workflows/ci.yml` (agregar step de e2e)

**Criterios de aceptación:**
- [ ] Tests E2E cubren flujo completo de registro a reseña
- [ ] Tests usan base de datos aislada (Neon branch o test DB)
- [ ] Tests se ejecutan en CI
- [ ] Cobertura de código >= 80%
- [ ] Tests son deterministas (mismo resultado siempre)

**Checklist:**
- [ ] Configurar base de datos de prueba
- [ ] Implementar tests E2E de auth
- [ ] Implementar tests E2E de booking flow
- [ ] Implementar tests E2E de pagos
- [ ] Integrar en CI
- [ ] Verificar cobertura

**Dependencias:**
- Fase 18 (CI/CD configurado)

**Tiempo estimado:** 4-5 días.

---

## Fase 20: Optimización, Seguridad y Escalabilidad 📝

**Objetivo:** Auditoría de seguridad, optimización de rendimiento y preparación para escalar.

**Descripción:**
Revisión de seguridad (OWASP top 10), optimización de queries Prisma, implementación de caché, rate limiting global, logging centralizado, y preparación para escalar horizontalmente.

**Entregables:**
- Auditoría de seguridad (reporte)
- Rate limiting global (@nestjs/throttler)
- Caché de consultas frecuentes (Redis opcional)
- Optimización de queries Prisma (índices, selects, lazy loading)
- Logging estructurado (Pino o Winston)
- Health check endpoints
- Rate limiting por endpoint (50 req/min por IP)
- Documentación de seguridad actualizada

**Archivos afectados:**
- `backend/src/common/guards/throttler.guard.ts` (nuevo)
- `backend/src/common/interceptors/logging.interceptor.ts` (nuevo)
- `backend/src/health/health.controller.ts` (nuevo)
- `backend/src/health/health.module.ts` (nuevo)
- `backend/prisma/schema.prisma` (optimizar índices)
- `backend/package.json` (agregar dependencias)
- `.claude/SECURITY.md` (actualizar)

**Criterios de aceptación:**
- [ ] Rate limiting global funciona (429 después de N requests)
- [ ] Health check endpoint retorna estado del sistema
- [ ] Logs estructurados con niveles (info, warn, error)
- [ ] Auditoría de seguridad completada sin hallazgos críticos
- [ ] Queries Prisma optimizadas (N+1 queries eliminados)
- [ ] Cobertura de tests se mantiene >= 80%

**Checklist:**
- [ ] Implementar throttler global
- [ ] Implementar logging estructurado
- [ ] Implementar health checks
- [ ] Revisar y optimizar queries Prisma
- [ ] Ejecutar auditoría de seguridad
- [ ] Corregir hallazgos
- [ ] Actualizar documentación de seguridad

**Dependencias:**
- Fase 19 (tests E2E pasando)

**Tiempo estimado:** 4-5 días.

---

## Resumen de Fases

| Fase | Nombre | Estado | Días Est. | Dependencias |
|------|--------|--------|-----------|--------------|
| 0 | Fundación del Proyecto | ✅ Completa | — | — |
| 1 | Autenticación OTP + JWT | ✅ Completa | 2-3 | Fase 0 |
| 2 | Reseñas (Reviews) | 📝 Pendiente | 1-2 | Fase 0, 1 |
| 3 | Asignación Servicio-Prestador | 📝 Pendiente | 1 | Fase 0 |
| 4 | Ciclo Completo de Reservas | 📝 Pendiente | 2 | Fase 0, 1 |
| 5 | Búsqueda y Filtros Avanzados | 📝 Pendiente | 2-3 | Fase 0 |
| 6 | Mobile: Proyecto y Navegación | 📝 Pendiente | 3-4 | Fase 0 |
| 7 | Mobile: Autenticación | 📝 Pendiente | 2-3 | Fase 1, 6 |
| 8 | Mobile: Home y Catálogo | 📝 Pendiente | 3-4 | Fase 6, 7 |
| 9 | Mobile: Flujo de Reserva | 📝 Pendiente | 3-4 | Fase 6, 8 |
| 10 | Mobile: Mis Reservas y Perfil | 📝 Pendiente | 3-4 | Fase 2, 4, 7 |
| 11 | Notificaciones Push | 📝 Pendiente | 3-4 | Fase 4, 6 |
| 12 | Admin: Proyecto y Dashboard | 📝 Pendiente | 4-5 | Fase 1, 5 |
| 13 | Admin: CRUD Cities y Services | 📝 Pendiente | 2-3 | Fase 12 |
| 14 | Admin: CRUD Providers y Clients | 📝 Pendiente | 3-4 | Fase 12 |
| 15 | Admin: Gestión de Reservas | 📝 Pendiente | 3-4 | Fase 4, 12 |
| 16 | Analíticas y Reportes | 📝 Pendiente | 3-4 | Fase 12, 15 |
| 17 | Pagos (Mercado Pago/Stripe) | 📝 Pendiente | 5-7 | Fase 4, 9 |
| 18 | Despliegue y DevOps | 📝 Pendiente | 4-5 | Fase 0-17 |
| 19 | Tests E2E | 📝 Pendiente | 4-5 | Fase 18 |
| 20 | Optimización y Seguridad | 📝 Pendiente | 4-5 | Fase 19 |

**Total días estimados restantes:** 57-79 días hábiles (~3-4 meses).

---

*Documento de roadmap — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
