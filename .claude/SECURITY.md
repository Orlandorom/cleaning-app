# Security — Cleaning App

> Arquitectura y políticas de seguridad del backend. Define cómo se maneja autenticación, autorización, rate limiting, validación de datos y mejores prácticas OWASP.

---

## Índice

1. [Autenticación JWT](#1-autenticación-jwt)
2. [Refresh Tokens](#2-refresh-tokens)
3. [Roles y Autorización](#3-roles-y-autorización)
4. [Guards](#4-guards)
5. [Hash de Contraseñas](#5-hash-de-contraseñas)
6. [Validaciones](#6-validaciones)
7. [Rate Limiting](#7-rate-limiting)
8. [CORS](#8-cors)
9. [Variables de Entorno Sensibles](#9-variables-de-entorno-sensibles)
10. [OWASP Top 10 — Mitigaciones](#10-owasp-top-10--mitigaciones)
11. [Buenas Prácticas Generales](#11-buenas-prácticas-generales)

---

## 1. Autenticación JWT

### 1.1 Estrategia

La API usa **JWT (JSON Web Tokens)** como mecanismo de autenticación stateless. No se usan sessions del lado del servidor.

### 1.2 Librerías

```bash
# Instaladas en backend/
@nestjs/jwt       — Módulo NestJS para JWT
@nestjs/passport  — Integración de Passport con NestJS
passport          — Estrategias de autenticación
passport-jwt      — Estrategia JWT para Passport
```

### 1.3 Configuración (JwtModule)

```typescript
// app.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60m' },
});
```

| Variable | Propósito | Requerido |
|----------|-----------|-----------|
| `JWT_SECRET` | Clave secreta para firmar tokens | Sí |
| `expiresIn` | Tiempo de expiración (60 minutos) | — |

### 1.4 Payload del Token

```json
{
  "sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "role": "client",
  "iat": 1721740800,
  "exp": 1721744400
}
```

| Claim | Tipo | Descripción |
|-------|------|-------------|
| `sub` | string | UUID del usuario autenticado (client o provider) |
| `role` | string | Rol del usuario: `client`, `provider`, `admin` |
| `iat` | number | Fecha de emisión (Unix timestamp en segundos) |
| `exp` | number | Fecha de expiración (Unix timestamp en segundos) |

### 1.5 Flujo de Autenticación

```
Cliente                        API
  │                              │
  │  POST /auth/login            │
  │  { phone, code }             │
  │ ──────────────────────────>  │
  │                              │ Verificar OTP + crear/find user
  │                              │
  │  { token, refreshToken, user }│
  │ <──────────────────────────  │
  │                              │
  │  GET /bookings               │
  │  Authorization: Bearer <jwt> │
  │ ──────────────────────────>  │
  │                              │ Validar JWT + extraer user
  │                              │
  │  [200] lista de bookings     │
  │ <──────────────────────────  │
```

### 1.6 Validación del Token

La estrategia `JwtStrategy` (Passport) se encarga de:

1. Extraer el token de la cabecera `Authorization: Bearer <token>`.
2. Verificar la firma con `JWT_SECRET`.
3. Verificar que el token no haya expirado (`exp`).
4. Extraer el payload (`sub`, `role`).
5. Buscar el usuario en BD (client o provider según `role`).
6. Adjuntar el usuario al request (`req.user`).

### 1.7 Seguridad del JWT

| Práctica | Implementación |
|----------|---------------|
| Firma HS256 | Algoritmo por defecto de `@nestjs/jwt` |
| Expiración | 60 minutos (configurable vía `JWT_EXPIRATION`) |
| Sin datos sensibles en payload | Solo `sub` y `role` — no incluir nombre, email, teléfono |
| Clave secreta fuerte | `JWT_SECRET` debe ser un string aleatorio de al menos 64 caracteres |
| Rotación de clave | `JWT_SECRET` debe rotarse periódicamente (cada 90 días) |
| No almacenar en localStorage | El frontend debe usar `httpOnly` cookies o `Secure` storage |

### 1.8 Validación de JWT_SECRET al Inicio

```typescript
// main.ts
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

---

## 2. Refresh Tokens

### 2.1 Estrategia

Se usan **refresh tokens** duraderos (30 días) para emitir nuevos access tokens sin requerir re-autenticación.

### 2.2 Flujo

```
Access Token expira (60 min)
       │
       ▼
Cliente envía refreshToken a POST /auth/refresh
       │
       ▼
API valida refreshToken en BD
       │
       ▼
API emite nuevo access token + nuevo refresh token
       │
       ▼
Cliente recibe { token, refreshToken }
```

### 2.3 Almacenamiento

Los refresh tokens se almacenan en la base de datos:

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String   // UUID del client o provider
  role      String   // "client" | "provider"
  expiresAt DateTime
  createdAt DateTime @default(now())
  revoked   Boolean  @default(false)

  @@index([userId])
}
```

### 2.4 Ciclo de Vida

| Elemento | Duración | Almacenamiento |
|----------|----------|----------------|
| Access Token | 60 minutos | En memoria / httpOnly cookie |
| Refresh Token | 30 días | BD (tabla RefreshToken) |

### 2.5 Seguridad de Refresh Tokens

| Práctica | Implementación |
|----------|---------------|
| Token único | UUID v4 aleatorio |
| Expiración | 30 días en BD |
| Revocación | Se marca `revoked: true` al usar o al hacer logout |
| Single-use | Cada refresh emite un nuevo par (access + refresh) e invalida el anterior |
| Rotación | El refresh anterior se revoca al emitir uno nuevo |
| Almacenamiento | Hash del token en BD (no el token en texto plano) — o UUID simple con expiración |

### 2.6 Endpoints

```http
POST /auth/register  → { token, refreshToken, user }
POST /auth/login     → { token, refreshToken, user }
POST /auth/refresh   → { token, refreshToken }
```

---

## 3. Roles y Autorización

### 3.1 Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| `client` | Usuario que contrata servicios de limpieza |
| `provider` | Prestador de servicios de limpieza |
| `admin` | Administrador del sistema |

### 3.2 Permisos por Rol

| Endpoint | client | provider | admin |
|----------|--------|----------|-------|
| `POST /auth/register` | ✅ | ❌ | ❌ |
| `POST /auth/login` | ✅ | ✅ | ❌ |
| `GET /providers` | ✅ | ❌ | ✅ |
| `POST /bookings` | ✅ | ❌ | ❌ |
| `GET /bookings` | Solo propias | Solo asignadas | Todas |
| `PATCH /bookings/:id` | ❌ | Solo aceptar/rechazar | Todas |
| `POST /reviews` | ✅ | ❌ | ❌ |
| `POST /services` | ❌ | ❌ | ✅ |
| `DELETE /cities` | ❌ | ❌ | ✅ |

### 3.3 Implementación de Roles

```typescript
// 1. Decorador @Roles
@SetMetadata('roles', ['admin'])
@Roles('admin')  // decorador personalizado

// 2. RolesGuard
@UseGuards(JwtAuthGuard, RolesGuard)

// 3. Controlador
@Patch(':id')
@Roles('admin')
async update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
  return this.service.update(id, dto);
}
```

### 3.4 Protección por Recurso (Ownership)

Además de roles, se debe verificar que el usuario acceda solo a sus propios recursos:

```typescript
// Ejemplo: un cliente solo puede ver sus propias reservas
@Get()
@UseGuards(JwtAuthGuard)
async findByUser(@Req() req, @Query() query: QueryBookingDto) {
  // Si el usuario es client, forzar su clientId
  if (req.user.role === 'client') {
    query.clientId = req.user.sub;
  }
  return this.service.findAll(query);
}
```

---

## 4. Guards

### 4.1 Guards Implementados

| Guard | Propósito | Implementado |
|-------|-----------|--------------|
| `JwtAuthGuard` | Verificar token JWT y autenticar usuario | NestJS + Passport |
| `RolesGuard` | Verificar rol del usuario | Decorador `@Roles()` |
| `ThrottlerGuard` | Rate limiting | Futuro |

### 4.2 JwtAuthGuard

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- Extiende `AuthGuard('jwt')` de `@nestjs/passport`.
- Usa `JwtStrategy` para validar el token.
- Adjunta el usuario a `req.user` con `{ id, role }`.
- Retorna `401 Unauthorized` si el token falta, es inválido o expiró.

### 4.3 RolesGuard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### 4.4 Uso Combinado

```typescript
@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async adminOnly() { ... }
```

### 4.5 Endpoints Públicos vs Protegidos

| Tipo | Guard | Ejemplos |
|------|-------|----------|
| Público | Sin guard | `POST /auth/login`, `POST /auth/register`, `POST /sms/otp/send` |
| Autenticado | `JwtAuthGuard` | `GET /bookings`, `POST /bookings`, `POST /reviews` |
| Admin | `JwtAuthGuard` + `RolesGuard` + `@Roles('admin')` | `POST /services`, `DELETE /cities` |

---

## 5. Hash de Contraseñas

### 5.1 Estrategia

**No hay contraseñas.** La autenticación es mediante **OTP + teléfono** (passwordless).

Los usuarios se autentican con su número de teléfono + un código de un solo uso enviado por SMS.

### 5.2 Implicaciones de Seguridad

| Aspecto | Medida |
|---------|--------|
| Sin contraseñas | No hay riesgo de filtrado de passwords |
| OTP | Código de 6 dígitos, 10 min de vida, máx 5 intentos |
| Teléfono | Validado con regex `/^\+[1-9]\d{6,14}$/` |
| SMS | Enviado vía Twilio (no logs en consola en producción) |
| Replay attack | OTP expira después del primer uso exitoso |
| Bruteforce | Límite de 5 intentos por OTP |

### 5.3 Futuro (Admin)

Si en el futuro se implementa autenticación con contraseña para el panel admin:

```typescript
// PASSWORD HASHING (FUTURO)
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

| Práctica | Valor |
|----------|-------|
| Algoritmo | bcrypt |
| Salt rounds | 12 (≈250ms por hash en hardware moderno) |
| Almacenamiento | Solo hash, nunca texto plano |
| Longitud mínima | 8 caracteres |
| Complejidad | Al menos 1 mayúscula, 1 minúscula, 1 número |

---

## 6. Validaciones

### 6.1 Validación de Entrada (DTOs)

Toda entrada del usuario se valida mediante **class-validator** + **class-transformer**:

```typescript
// Global ValidationPipe en main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // Elimina campos no decorados
  forbidNonWhitelisted: true,   // Error 400 si hay campos extraños
  transform: true,              // Transforma tipos (string → number, etc.)
}));
```

### 6.2 Validaciones Específicas

| Validación | DTO | Regla |
|------------|-----|-------|
| Nombre no vacío | `CreateCityDto` | `@IsString()`, `@IsNotEmpty()` |
| Teléfono internacional | `CreateClientDto` | `@Matches(/^\+[1-9]\d{6,14}$/)` |
| UUID válido | `QueryBookingDto` | `@IsUUID()` para `clientId`, `providerId` |
| Enum válido | `QueryServiceDto` | `@IsEnum(ServiceType)` |
| Fecha futura | `CreateBookingDto` | `@IsDate()`, custom validator |
| Número positivo | `PriceDto` | `@IsNumber()`, `@Min(0)` |
| Strings no vacías | All DTOs | `@IsNotEmpty()` |

### 6.3 Validación de Negocio (Servicios)

Además de validación de input, los servicios validan reglas de negocio:

| Regla | Módulo | Validación |
|-------|--------|------------|
| Nombre único | Cities, Services | Buscar duplicado antes de crear |
| Teléfono único | Clients, Providers | Buscar duplicado antes de crear |
| FK existe | Bookings | Verificar client/provider/service existen |
| Estado válido | Bookings | Transiciones permitidas entre estados |
| OTP expirado | SMS | Verificar `expiresAt > now()` |
| OTP intentos | SMS | Verificar `attempts < 5` |

### 6.4 Sanitización

| Técnica | Aplica a |
|---------|----------|
| `whitelist: true` | Todos los DTOs |
| `forbidNonWhitelisted: true` | Todos los DTOs |
| `trim()` de class-validator | Strings |
| `Transform` para tipos | Números, booleanos |
| UUID validation | IDs en parámetros y body |

---

## 7. Rate Limiting

### 7.1 Rate Limiting de OTP (Actual)

```typescript
// En sms.service.ts
const MAX_ATTEMPTS = 5;
```

| Límite | Valor |
|--------|-------|
| Intentos por código OTP | Máximo 5 |
| Ventana de tiempo | 10 minutos (vida del código) |
| Almacenamiento | Base de datos (`Otp.attempts`) |
| Response | `400 Bad Request` — "Demasiados intentos fallidos. Solicite un nuevo código." |
| Reseteo | Al solicitar un nuevo código OTP |

### 7.2 Rate Limiting Global (Futuro)

```typescript
// app.module.ts (futuro)
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,      // 1 minuto
      limit: 100,      // 100 peticiones por minuto
    }]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
```

| Límite | Valor | TTL |
|--------|-------|-----|
| General | 100 requests | 1 minuto |
| Auth endpoints | 10 requests | 1 minuto |
| OTP send | 3 requests | 10 minutos por teléfono |

### 7.3 Headers de Rate Limit

```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1620000000
```

### 7.4 Consideraciones

- Los rate limits se aplican por **IP** (no por usuario).
- OTP se limita por **teléfono** (no solo por IP).
- En producción, usar **Redis** como store en lugar de memoria.
- El rate limiting protege contra **brute force**, **DoS** y **abuso de SMS**.

---

## 8. CORS

### 8.1 Configuración Actual

```typescript
// main.ts
app.enableCors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,   // Permitir cookies (refresh token)
});
```

### 8.2 CORS por Entorno

```env
# Desarrollo — orígenes locales
CORS_ORIGINS=http://localhost:5173,http://localhost:19006

# Staging — orígenes de staging
CORS_ORIGINS=https://staging-admin.cleaning-app.com,https://staging-app.cleaning-app.com

# Producción — solo dominios reales
CORS_ORIGINS=https://admin.cleaning-app.com,https://app.cleaning-app.com
```

### 8.3 Reglas CORS

| Regla | Valor |
|-------|-------|
| `origin` | Lista blanca de dominios permitidos |
| `methods` | `GET, POST, PATCH, DELETE` |
| `allowedHeaders` | `Content-Type, Authorization` |
| `credentials` | `true` (necesario para httpOnly cookies) |
| Wildcard `*` | Solo en desarrollo — nunca en producción |

### 8.4 Seguridad CORS

1. **Nunca** usar `Access-Control-Allow-Origin: *` en producción.
2. Mantener una **whitelist explícita** de orígenes.
3. No exponer cabeceras sensibles.
4. Validar que `OPTIONS` (preflight) retorne los headers correctos.

---

## 9. Variables de Entorno Sensibles

### 9.1 Variables Críticas

| Variable | Propósito | Protección |
|----------|-----------|------------|
| `DATABASE_URL` | Conexión a PostgreSQL (contiene user/password) | .gitignore, secreto en deploy |
| `JWT_SECRET` | Firma de tokens JWT | .gitignore, rotación periódica |
| `TWILIO_ACCOUNT_SID` | SID de cuenta Twilio | .gitignore |
| `TWILIO_AUTH_TOKEN` | Token de autenticación Twilio | .gitignore, más sensible que SID |
| `TWILIO_PHONE_NUMBER` | Número remitente SMS | .gitignore |

### 9.2 Protección en Código

```typescript
// Validación al inicio (main.ts)
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

### 9.3 Buenas Prácticas

| Práctica | Implementación |
|----------|---------------|
| No hardcodear secrets | Siempre usar `process.env` |
| `.env` en .gitignore | El archivo `.env` no se sube al repo |
| `.env.example` | Template sin valores reales, documento en repo |
| Variables descriptivas | Nombres en UPPER_SNAKE_CASE con prefijo del servicio |
| Validación al inicio | Fallar rápido si falta variable crítica |
| No loguear secrets | Prohibido hacer `console.log(process.env.JWT_SECRET)` |
| Rotación de claves | JWT_SECRET debe rotarse cada 90 días |

### 9.4 Ejemplo de `.env.example`

```env
# ============================================
# Cleaning App — Environment Variables
# ============================================
# Database
DATABASE_URL=postgresql://user:password@host:5432/cleaning_app

# JWT
JWT_SECRET=your-secret-key-at-least-64-characters-long
JWT_EXPIRATION=60m

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:19006

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Server
PORT=3000
NODE_ENV=development
```

---

## 10. OWASP Top 10 — Mitigaciones

### 10.1 A01: Broken Access Control

| Riesgo | Mitigación |
|--------|------------|
| Usuario accede a recurso de otro | Ownership checks en servicios (req.user.sub vs recurso.userId) |
| Usuario realiza acción sin rol | RolesGuard + @Roles decorator |
| IDOR (Insecure Direct Object Reference) | Validar que el UUID del recurso pertenece al usuario autenticado |
| Escalación de privilegios | Nunca confiar en el rol enviado por el cliente; extraer del token |

**Implementación:**

```typescript
// Verificar ownership antes de modificar
async function update(id: string, dto: UpdateDto, userId: string) {
  const booking = await this.findOrFail(id);
  if (booking.clientId !== userId) {
    throw new ForbiddenException('No tienes permiso para modificar esta reserva');
  }
  // ...
}
```

### 10.2 A02: Cryptographic Failures

| Riesgo | Mitigación |
|--------|------------|
| JWT sin firma | Usar HS256 con clave secreta fuerte |
| Datos sensibles en JWT payload | Solo incluir sub y role |
| Token sin expiración | expiresIn: '60m' |
| Conexión DB sin SSL | `sslmode=require` en DATABASE_URL de producción |
| Secrets en código | Siempre usar variables de entorno |

### 10.3 A03: Injection

| Riesgo | Mitigación |
|--------|------------|
| SQL Injection | Prisma ORM — queries parametrizadas por defecto |
| NoSQL Injection | No aplica (PostgreSQL) |
| OS Command Injection | No ejecutar comandos del sistema |
| LDAP Injection | No aplica |

**Regla:** Prisma ORM previene SQL Injection al usar queries parametrizadas. Nunca usar `$queryRawUnsafe` con input del usuario.

### 10.4 A04: Insecure Design

| Riesgo | Mitigación |
|--------|------------|
| Falta de rate limiting | Rate limiting en OTP (5 intentos) + global futuro |
| Validación insuficiente | ValidationPipe + DTOs + validación de negocio |
| Confiar en input del cliente | whitelist + forbidNonWhitelisted |
| Falta de trazabilidad | Logger con request ID |

### 10.5 A05: Security Misconfiguration

| Riesgo | Mitigación |
|--------|------------|
| CORS demasiado permisivo | Whitelist explícita por entorno |
| Errores con stack trace | AllExceptionsFilter sin stack trace en producción |
| Default credentials | No aplica (passwordless) |
| Headers de seguridad faltantes | Helmet (futuro) |

### 10.6 A06: Vulnerable and Outdated Components

| Riesgo | Mitigación |
|--------|------------|
| Dependencias desactualizadas | `npm audit` regular, Dependabot en GitHub |
| Node.js desactualizado | Mantener LTS actual |
| NestJS desactualizado | Actualizaciones regulares |

### 10.7 A07: Identification and Authentication Failures

| Riesgo | Mitigación |
|--------|------------|
| Bruteforce en login | Rate limiting en OTP |
| Session fixation | Stateless JWT — no hay sessions |
| Credenciales débiles | Passwordless (OTP) |
| Token no revocado | Refresh token revocable en BD |

### 10.8 A08: Software and Data Integrity Failures

| Riesgo | Mitigación |
|--------|------------|
| Dependencias maliciosas | Package-lock.json verificado |
| Actualizaciones sin verificar | CI/CD con npm audit |
| Datos corruptos | Validación de entrada en todos los DTOs |

### 10.9 A09: Security Logging and Monitoring Failures

| Riesgo | Mitigación |
|--------|------------|
| Falta de logging | Logger global con request context |
| No monitorear errores 500 | AllExceptionsFilter loggea errores 500 |
| Sin alertas | Futuro: integración con Sentry o similar |
| Logs con datos sensibles | Prohibido loguear tokens, passwords, OTPs |

**Regla de logging:**

```typescript
// ✅ Permitido
this.logger.log(`Reserva ${id} creada por cliente ${clientId}`);

// ❌ Prohibido (datos sensibles)
this.logger.log(`OTP ${otp.code} enviado a ${phone}`);
this.logger.log(`Token: ${token}`);
```

### 10.10 A10: SSRF (Server-Side Request Forgery)

| Riesgo | Mitigación |
|--------|------------|
| Fetch a URLs internas | No aplica actualmente (no hacemos fetch a URLs del usuario) |
| Webhooks a destinos no validados | Validar URLs si se implementan webhooks |

---

## 11. Buenas Prácticas Generales

### 11.1 Transport Layer Security (TLS/HTTPS)

| Entorno | Protocolo |
|---------|-----------|
| Desarrollo | HTTP (localhost) |
| Producción | HTTPS obligatorio — TLS 1.2+ |
| Certificado | Let's Encrypt o proveedor cloud |
| HSTS | Cabecera `Strict-Transport-Security` en producción |

### 11.2 HTTP Security Headers (Futuro con Helmet)

```typescript
// main.ts (futuro)
import helmet from 'helmet';
app.use(helmet());
```

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Content-Security-Policy: default-src 'self'
```

### 11.3 Manejo Seguro de Errores

```typescript
// ❌ Incorrecto — expone detalles internos
throw new InternalServerErrorException(error.message);

// ✅ Correcto — mensaje genérico + log interno
this.logger.error(`Error al crear booking: ${error.message}`, error.stack);
throw new InternalServerErrorException('Error interno del servidor');
```

### 11.4 Validación de IDs UUID

```typescript
// Siempre validar que los UUIDs en parámetros sean válidos
@Get(':id')
async findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.service.findOne(id);
}
```

### 11.5 Checklist de Seguridad por Nuevo Endpoint

- [ ] ¿El endpoint requiere autenticación? → Agregar `@UseGuards(JwtAuthGuard)`
- [ ] ¿Solo ciertos roles pueden acceder? → Agregar `@Roles()` + `RolesGuard`
- [ ] ¿El usuario solo debe acceder a sus propios recursos? → Ownership check
- [ ] ¿Se validaron todos los inputs? → DTOs con class-validator
- [ ] ¿Se validaron los UUIDs? → `ParseUUIDPipe` o `@IsUUID()`
- [ ] ¿Hay rate limiting necesario? → Considerar para endpoints sensibles
- [ ] ¿Se loggean datos sensibles? → Revisar que no haya tokens, passwords, OTPs
- [ ] ¿El mensaje de error expone información interna? → Usar mensaje genérico + log
- [ ] ¿Se documentó en Swagger las respuestas de error posibles? → `@ApiResponse`

### 11.6 Seguridad en Base de Datos

```prisma
// No almacenar datos sensibles en texto plano
model Otp {
  code      String    // Almacenar hash en producción (futuro)
  phone     String    // Validado con regex
  attempts  Int       @default(0)
  expiresAt DateTime
  verified  Boolean   @default(false)
}

// Índices para performance y seguridad (evitar table scans)
@@index([phone])
@@index([expiresAt])
```

### 11.7 Manejo de Secretos en CI/CD

| Plataforma | Método |
|------------|--------|
| GitHub Actions | Secrets del repositorio |
| Vercel / Railway | Environment variables del proyecto |
| Docker | Secrets de Docker Swarm o variables de entorno |
| Local | Archivo `.env` (nunca commitear) |

### 11.8 Respuesta a Incidentes

| Evento | Acción |
|--------|--------|
| JWT_SECRET comprometido | Rotar inmediatamente + revocar todos los tokens |
| Filtrado de base de datos | Rotar DATABASE_URL + notificar usuarios afectados |
| Abuso de OTP | Aumentar rate limiting + revisar logs |
| DoS | Escalar infraestructura + Cloudflare / WAF |

---

*Documento de seguridad — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
