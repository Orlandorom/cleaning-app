# API Conventions — Cleaning App

> Convenciones de diseño de API REST. Define el formato de respuestas, errores, paginación, filtros, autenticación y documentación para todo el backend.

---

## Índice

1. [Base URL](#1-base-url)
2. [Formato General de Respuestas](#2-formato-general-de-respuestas)
3. [Formato de Errores](#3-formato-de-errores)
4. [HTTP Status Codes](#4-http-status-codes)
5. [Paginación](#5-paginación)
6. [Filtros](#6-filtros)
7. [Sorting (Ordenamiento)](#7-sorting-ordenamiento)
8. [Endpoints CRUD Estándar](#8-endpoints-crud-estándar)
9. [Naming Conventions](#9-naming-conventions)
10. [Autenticación JWT](#10-autenticación-jwt)
11. [Versionado de API](#11-versionado-de-api)
12. [Swagger / OpenAPI](#12-swagger--openapi)
13. [Cabeceras HTTP](#13-cabeceras-http)
14. [Rate Limiting](#14-rate-limiting)
15. [Ejemplos por Módulo](#15-ejemplos-por-módulo)
16. [Guía de Diseño de Endpoints](#16-guía-de-diseño-de-endpoints)

---

## 1. Base URL

### 1.1 Desarrollo

```
http://localhost:3000/
http://localhost:3000/api/docs     ← Swagger UI
```

### 1.2 Producción

```
https://api.cleaning-app.com/
https://api.cleaning-app.com/api/docs     ← Swagger UI
```

### 1.3 Prefijo Global

Actualmente no hay prefijo global (`/api/`). Los endpoints son directos:

```
POST   /cities
GET    /cities
GET    /cities/:id
PATCH  /cities/:id
DELETE /cities/:id
```

Si en el futuro se agrega un prefijo global, se hará en `main.ts`:

```typescript
app.setGlobalPrefix('api');
```

Lo que resultaría en:

```
POST   /api/cities
GET    /api/cities
...
```

---

## 2. Formato General de Respuestas

### 2.1 Respuesta Exitosa (Objeto Individual)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Bogotá",
  "createdAt": "2026-07-23T12:00:00.000Z"
}
```

### 2.2 Respuesta Exitosa (Lista)

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Bogotá",
    "createdAt": "2026-07-23T12:00:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Medellín",
    "createdAt": "2026-07-23T12:00:00.000Z"
  }
]
```

### 2.3 Respuesta con Relaciones (Include)

Cuando la respuesta incluye relaciones, se anidan en el mismo objeto:

```json
{
  "id": "booking-uuid",
  "status": "PENDING",
  "scheduledAt": "2026-08-01T14:00:00.000Z",
  "address": "Calle 123 #45-67",
  "totalPrice": 150000,
  "createdAt": "2026-07-23T12:00:00.000Z",
  "updatedAt": "2026-07-23T12:00:00.000Z",
  "client": {
    "id": "client-uuid",
    "name": "Carlos López",
    "phone": "+573001234567"
  },
  "provider": {
    "id": "provider-uuid",
    "name": "Juan Pérez",
    "phone": "+573009876543"
  },
  "service": {
    "id": "service-uuid",
    "name": "Limpieza General",
    "type": "GENERAL",
    "duration": 120
  }
}
```

### 2.4 Respuesta de Acción (Sin Entidad)

Para endpoints que realizan acciones sin retornar una entidad:

```json
{
  "message": "Código enviado exitosamente"
}
```

### 2.5 Reglas de Formato de Respuestas

| Regla | Aplica a |
|-------|---------|
| Formato: JSON | Todas las respuestas |
| Fechas: ISO 8601 (`2026-07-23T12:00:00.000Z`) | Campos createdAt, updatedAt, scheduledAt, expiresAt |
| IDs: UUID v4 (`a1b2c3d4-e5f6-7890-abcd-ef1234567890`) | Todos los IDs |
| Decimales: punto como separador (`150000.50`) | totalPrice, rating |
| Booleanos: `true` / `false` | isAvailable, verified |
| Nulos: `null` (no omitir campos) | Campos opcionales sin valor |
| Enums: string en UPPER_SNAKE_CASE | status, type |

### 2.6 Campos Incluidos por Defecto

Todas las respuestas incluyen por defecto:

- `id` — Siempre presente.
- `createdAt` — Siempre presente.
- `updatedAt` — Solo si el modelo tiene `@updatedAt`.
- Relaciones relevantes vía `include` (client, provider, service en Bookings; city en Providers).

---

## 3. Formato de Errores

### 3.1 Estructura General

```json
{
  "statusCode": 404,
  "message": "Ciudad con id \"abc-123\" no encontrada",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

### 3.2 Error de Validación (400)

```json
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "name should not be empty"
  ],
  "error": "Bad Request",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

**Nota:** El `message` es un **array** en errores de validación (proviene de class-validator). El campo `error` es el nombre del error HTTP.

### 3.3 Error de Negocio (404, 409, 400)

```json
// 404 - No encontrado
{
  "statusCode": 404,
  "message": "Ciudad con id \"abc-123\" no encontrada",
  "timestamp": "2026-07-23T12:00:00.000Z"
}

// 409 - Conflicto (duplicado)
{
  "statusCode": 409,
  "message": "El teléfono \"+573001234567\" ya está registrado",
  "timestamp": "2026-07-23T12:00:00.000Z"
}

// 400 - Error de negocio (no validación)
{
  "statusCode": 400,
  "message": "Código OTP incorrecto",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

### 3.4 Error Interno (500)

```json
{
  "statusCode": 500,
  "message": "Error interno del servidor",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

**Nota:** En desarrollo, el `AllExceptionsFilter` puede incluir el stack trace en la respuesta. En producción **nunca** se exponen detalles internos.

### 3.5 Error de Autenticación (401) — Futuro

```json
{
  "statusCode": 401,
  "message": "No autenticado",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

### 3.6 Error de Autorización (403) — Futuro

```json
{
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

### 3.7 Reglas de Errores

| Regla | Descripción |
|-------|-------------|
| **Mensajes en español** | Todos los mensajes de error dirigidos al usuario final |
| **Consistencia** | Misma estructura `{ statusCode, message, timestamp }` para todos los errores |
| **Sin stack traces** | No exponer detalles internos al cliente |
| **IDs en mensajes** | Incluir el ID del recurso en mensajes de NotFound (`"id \"abc\" no encontrado"`) |
| **Valores en mensajes** | Incluir el valor conflictivo en mensajes de Conflict (`"teléfono \"+57...\" ya registrado"`) |
| **Validation errors** | Array de strings con descripciones de class-validator |
| **Sin HTML** | Nunca retornar HTML en errores (solo JSON) |

---

## 4. HTTP Status Codes

### 4.1 Códigos Utilizados

| Código | Nombre | Uso |
|--------|--------|-----|
| `200` | OK | Respuesta exitosa GET, PATCH, DELETE |
| `201` | Created | Respuesta exitosa POST (creación) |
| `204` | No Content | Respuesta exitosa sin cuerpo (no usado actualmente) |
| `400` | Bad Request | Error de validación de DTO, error de negocio (OTP incorrecto) |
| `401` | Unauthorized | No autenticado (futuro) |
| `403` | Forbidden | Sin permisos (futuro) |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Violación de unicidad (duplicado) |
| `429` | Too Many Requests | Rate limit excedido (futuro) |
| `500` | Internal Server Error | Error inesperado del servidor |

### 4.2 Mapeo Excepción → Código

| Excepción NestJS | Código | Uso |
|------------------|--------|-----|
| `BadRequestException` | 400 | Validación de DTO, OTP incorrecto, datos inválidos |
| `NotFoundException` | 404 | Recurso no existe |
| `ConflictException` | 409 | Violación de unicidad |
| `UnauthorizedException` | 401 | Token faltante o inválido |
| `ForbiddenException` | 403 | Rol sin permisos |
| `HttpException` | (definido) | Cualquier otro error HTTP |
| (No capturada) | 500 | Error interno |

### 4.3 Códigos por Método HTTP

| Método | Éxito | Error común |
|--------|-------|-------------|
| `POST` | `201 Created` | `400` (validación), `409` (duplicado), `404` (FK no existe) |
| `GET` (lista) | `200 OK` | — |
| `GET` (por ID) | `200 OK` | `404` (no encontrado) |
| `PATCH` | `200 OK` | `404` (no encontrado), `409` (duplicado), `400` (validación) |
| `DELETE` | `200 OK` | `404` (no encontrado) |

---

## 5. Paginación

### 5.1 Formato de Solicitud

```http
GET /cities?page=1&limit=10
GET /bookings?page=2&limit=25
```

| Parámetro | Tipo | Default | Máximo | Descripción |
|-----------|------|---------|--------|-------------|
| `page` | integer | 1 | — | Número de página (1-based) |
| `limit` | integer | 10 | 100 | Elementos por página |

### 5.2 Formato de Respuesta (Paginada)

```json
{
  "data": [
    { "id": "...", "name": "Bogotá" },
    { "id": "...", "name": "Medellín" }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 5.3 Estructura del Meta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `total` | integer | Total de registros en la consulta (sin paginar) |
| `page` | integer | Página actual |
| `limit` | integer | Elementos por página |
| `totalPages` | integer | Total de páginas (`Math.ceil(total / limit)`) |
| `hasNextPage` | boolean | `true` si hay más páginas después de esta |
| `hasPreviousPage` | boolean | `true` si no es la primera página |

### 5.4 Comportamiento sin Paginación

Actualmente los endpoints retornan arrays planos (sin paginar). La paginación se implementará en Fase 5 del roadmap.

```json
// Actual (sin paginación)
[
  { "id": "1", "name": "Bogotá" },
  { "id": "2", "name": "Medellín" }
]

// Futuro (con paginación activa)
{
  "data": [...],
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5, ... }
}
```

---

## 6. Filtros

### 6.1 Formato General

Los filtros se pasan como **query parameters** en endpoints GET.

```http
GET /providers?search=Juan&isAvailable=true&cityId=uuid
GET /bookings?status=PENDING&clientId=uuid
GET /services?type=DEEP
```

### 6.2 Tipos de Filtros

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Búsqueda textual | `?search=valor` (case-insensitive, contiene) | `?search=Bog` |
| Igualdad | `?campo=valor` | `?isAvailable=true` |
| Enum | `?campo=VALOR` | `?status=PENDING` |
| UUID | `?campo=uuid` | `?cityId=a1b2...` |
| Rango de fechas | `?startDate=&endDate=` | `?startDate=2026-01-01&endDate=2026-12-31` |
| Mínimo/Máximo | `?minRating=&maxPrice=` | `?minRating=4` |

### 6.3 Filtros por Módulo

| Módulo | Filtros Soportados |
|--------|-------------------|
| `GET /cities` | `?search=` (nombre) |
| `GET /services` | `?search=` (nombre), `?type=` (ServiceType) |
| `GET /providers` | `?search=` (nombre), `?isAvailable=` (boolean), `?cityId=` (UUID), `?minRating=` (1-5) |
| `GET /clients` | `?search=` (nombre) |
| `GET /bookings` | `?clientId=` (UUID), `?providerId=` (UUID), `?status=` (BookingStatus), `?startDate=` (ISO), `?endDate=` (ISO) |
| `GET /reviews` | `?providerId=` (UUID), `?minRating=` (1-5) |

### 6.4 Combinación de Filtros

Los filtros se combinan con **AND** lógico:

```http
GET /providers?search=Juan&isAvailable=true&cityId=abc-123
GET /bookings?status=PENDING&providerId=xyz-789&startDate=2026-08-01
```

TODOS los filtros deben cumplirse simultáneamente.

### 6.5 Búsqueda Textual

```http
GET /cities?search=Bog
GET /providers?search=Jua
```

| Característica | Valor |
|----------------|-------|
| Tipo | Case-insensitive |
| Operador | Contains (subcadena) |
| Ejemplo | `search=Bog` → `"Bogotá"`, `"Bogotá D.C."` |
| Mínimo caracteres | 1 |

### 6.6 Filtros por Rango (Fechas)

```http
GET /bookings?startDate=2026-08-01T00:00:00Z&endDate=2026-08-31T23:59:59Z
```

| Parámetro | Formato | Descripción |
|-----------|---------|-------------|
| `startDate` | ISO 8601 | Fecha mínima (inclusive) |
| `endDate` | ISO 8601 | Fecha máxima (inclusive) |

### 6.7 Reglas de Filtros

1. **Todos los filtros son opcionales** — si no se proporcionan, se retornan todos los registros.
2. **Los filtros se combinan con AND** — nunca OR.
3. **La búsqueda textual es case-insensitive** — usa `mode: 'insensitive'` en Prisma.
4. **UUIDs inválidos** deben retornar error 400.
5. **Valores booleanos** — aceptar `true`, `false`, `1`, `0`, `"true"`, `"false"`.

---

## 7. Sorting (Ordenamiento)

### 7.1 Formato de Solicitud

```http
GET /cities?sortBy=name&sortOrder=asc
GET /bookings?sortBy=scheduledAt&sortOrder=desc
```

| Parámetro | Tipo | Default | Valores |
|-----------|------|---------|---------|
| `sortBy` | string | `name` o `scheduledAt` | Nombre de campo válido |
| `sortOrder` | string | `asc` (o `desc` en bookings) | `asc`, `desc` |

### 7.2 Ordenamiento por Defecto

| Módulo | Campo por defecto | Orden |
|--------|------------------|-------|
| Cities | `name` | `asc` |
| Services | `name` | `asc` |
| Providers | `name` | `asc` |
| Clients | `name` | `asc` |
| Bookings | `scheduledAt` | `desc` (más reciente primero) |

### 7.3 Reglas de Sorting

1. **Siempre hay un orden por defecto** — nunca retornar datos sin orden.
2. **Los campos permitidos para sortBy** deben definirse por módulo (no todos los campos son ordenables).
3. **SQL injection** — sanitizar el campo sortBy contra injection (usar whitelist de campos permitidos).

---

## 8. Endpoints CRUD Estándar

### 8.1 Plantilla por Módulo

| Método | Path | Descripción | Request | Response | Errores |
|--------|------|-------------|---------|----------|---------|
| `POST` | `/{recursos}` | Crear | Body: CreateDto | `201` + entidad | `400`, `409` |
| `GET` | `/{recursos}` | Listar | Query: QueryDto | `200` + lista | — |
| `GET` | `/{recursos}/:id` | Obtener | — | `200` + entidad | `404` |
| `PATCH` | `/{recursos}/:id` | Actualizar | Body: UpdateDto | `200` + entidad | `404`, `409` |
| `DELETE` | `/{recursos}/:id` | Eliminar | — | `200` + entidad eliminada | `404` |

### 8.2 Endpoints No CRUD

| Método | Path | Descripción | Request | Response |
|--------|------|-------------|---------|----------|
| `POST` | `/sms/otp/send` | Enviar OTP | `{ phone }` | `{ message }` |
| `POST` | `/sms/otp/verify` | Verificar OTP | `{ phone, code }` | `{ message }` |
| `POST` | `/auth/register` | Registrar | `{ phone, code, name }` | `{ token, user }` |
| `POST` | `/auth/login` | Iniciar sesión | `{ phone, code }` | `{ token, user }` |

---

## 9. Naming Conventions

### 9.1 URLs

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Path** | Plural, lowercase, kebab-case | `/cities`, `/provider-services` |
| **Path params** | camelCase | `/:id`, `/:providerId` |
| **Query params** | camelCase | `?search=`, `?isAvailable=`, `?sortBy=`, `?startDate=` |
| **Body fields** | camelCase | `{ "clientId": "...", "totalPrice": 100 }` |

### 9.2 Reglas de URLs

1. **Siempre plural** — `/cities` no `/city`.
2. **Lowercase** — `/cities` no `/Cities`.
3. **Sin verbos** — `POST /cities` no `POST /createCity`.
4. **Sin extensiones** — `/cities` no `/cities.json`.
5. **kebab-case para multi-palabra** — `/provider-services` no `/providerServices`.
6. **Anidación mínima** — Preferir `GET /bookings?clientId=x` sobre `GET /clients/x/bookings`.

### 9.3 Nombres de Campos en JSON

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Propiedades | camelCase | `clientId`, `totalPrice`, `isAvailable` |
| IDs | `{entidad}Id` | `clientId`, `providerId`, `cityId` |
| Fechas | camelCase | `createdAt`, `scheduledAt`, `expiresAt` |
| Booleanos | pregunta | `isAvailable`, `hasNextPage`, `verified` |

---

## 10. Autenticación JWT

### 10.1 Esquema

La API usa **Bearer JWT** para autenticación.

### 10.2 Cabecera

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 10.3 Payload del Token

```json
{
  "sub": "user-uuid",
  "role": "client",
  "iat": 1721740800,
  "exp": 1721744400
}
```

| Claim | Tipo | Descripción |
|-------|------|-------------|
| `sub` | string | ID del usuario (cliente o prestador) |
| `role` | string | Rol del usuario: `client`, `provider`, `admin` |
| `iat` | number | Fecha de emisión (Unix timestamp) |
| `exp` | number | Fecha de expiración (Unix timestamp, 60 min) |

### 10.4 Endpoints de Auth

```http
POST /auth/register     # { phone, code, name } → { token, user }
POST /auth/login        # { phone, code } → { token, user }
POST /auth/refresh      # { refreshToken } → { token }
```

### 10.5 Protección de Rutas

| Nivel | Guard | Acceso |
|-------|-------|--------|
| Público | — | Cualquiera (registro, login, lista de servicios) |
| Autenticado | `@UseGuards(JwtAuthGuard)` | Clientes y prestadores logueados |
| Admin | `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')` | Solo administradores |

### 10.6 Swagger

La configuración de Swagger incluye `.addBearerAuth()` que habilita el botón "Authorize" enSwagger UI para enviar el token JWT en todas las peticiones.

---

## 11. Versionado de API

### 11.1 Estrategia Actual

**No hay versionado.** Todos los endpoints están en la raíz:

```
POST /cities
```

### 11.2 Estrategia Futura (cuando sea necesario)

```
/v1/cities
/v2/cities
```

Se implementará **solo cuando haya un cambio breaking** que no pueda convivir con la versión anterior. Mientras tanto, todos los cambios deben ser backward-compatible:

- Agregar campos opcionales a respuestas (no quitar).
- Agregar nuevos endpoints (no modificar existentes).
- Usar query params para nuevos comportamientos.

### 11.3 Reglas de Compatibilidad

```diff
# ✅ Cambio backward-compatible
+ "email": "user@email.com"     # Agregar campo opcional
+ ?includeExtra=true             # Query param para nuevo comportamiento

# ❌ Cambio breaking (requeriría v2)
- "name": "Juan"                # Quitar campo existente
- "name": "Juan Pérez"          # Cambiar formato de campo existente
```

---

## 12. Swagger / OpenAPI

### 12.1 Acceso

```
http://localhost:3000/api/docs
```

### 12.2 Configuración (main.ts)

```typescript
const swaggerConfig = new DocumentBuilder()
  .setTitle('Cleaning App API')
  .setDescription('API para el sistema de servicios de aseo')
  .setVersion('1.0')
  .addBearerAuth()                    // Botón Authorize para JWT
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api/docs', app, document);
```

### 12.3 Información en Swagger

| Campo | Valor |
|-------|-------|
| Título | Cleaning App API |
| Descripción | API para el sistema de servicios de aseo |
| Versión | 1.0 |
| Auth | Bearer JWT |

### 12.4 Decoradores por Tipo de Elemento

| Elemento | Decorador | Uso |
|----------|-----------|-----|
| **Controlador** | `@ApiTags('Cities')` | Agrupa endpoints en Swagger UI |
| **Endpoint** | `@ApiOperation({ summary: 'Crear una ciudad' })` | Descripción del endpoint |
| **Endpoint** | `@ApiResponse({ status: 201, description: 'Creada' })` | Posible respuesta |
| **Endpoint** | `@ApiParam({ name: 'id', description: 'ID' })` | Parámetro de ruta |
| **DTO propiedad** | `@ApiProperty({ example: 'Bogotá' })` | Campo requerido |
| **DTO propiedad** | `@ApiPropertyOptional({ example: 'nota' })` | Campo opcional |

### 12.5 Reglas de Documentación Swagger

1. **Todo endpoint** debe tener al menos `@ApiOperation` y `@ApiResponse` para 200/201.
2. **Todo código de error** posible debe documentarse con `@ApiResponse`.
3. **Todo parámetro de ruta** debe tener `@ApiParam`.
4. **Toda propiedad de DTO** debe tener `@ApiProperty` o `@ApiPropertyOptional`.
5. **Los enums** deben documentarse con `@ApiProperty({ enum: EnumName })`.
6. **Los ejemplos** deben ser realistas y en el contexto del negocio.

---

## 13. Cabeceras HTTP

### 13.1 Cabeceras de Solicitud

| Cabecera | Valor | Endpoint |
|----------|-------|----------|
| `Content-Type` | `application/json` | POST, PATCH |
| `Authorization` | `Bearer <token>` | Rutas protegidas |

### 13.2 Cabeceras de Respuesta

| Cabecera | Valor | Descripción |
|----------|-------|-------------|
| `Content-Type` | `application/json` | Siempre |
| `Access-Control-Allow-Origin` | configurado vía CORS | Variable por entorno |

### 13.3 CORS

Configurado vía `CORS_ORIGINS` en `.env`:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:19006
```

En producción, reemplazar con los dominios reales:

```env
CORS_ORIGINS=https://admin.cleaning-app.com,https://mobile.cleaning-app.com
```

---

## 14. Rate Limiting

### 14.1 Actual

El único rate limiting implementado es el de OTP:

| Límite | Valor |
|--------|-------|
| Intentos por código OTP | Máximo 5 |
| Ventana por OTP | 10 minutos (vida del código) |
| Response code | `400 Bad Request` + mensaje |
| Almacenamiento | Base de datos (Otp.attempts) |

### 14.2 Futuro (Global)

Se implementará rate limiting global con @nestjs/throttler:

| Límite | Valor |
|--------|-------|
| Peticiones por IP | 100 por minuto |
| Endpoints de auth | 10 por minuto |
| Response code | `429 Too Many Requests` |
| Almacenamiento | En memoria (o Redis en producción) |

---

## 15. Ejemplos por Módulo

### 15.1 Cities

```http
### Crear ciudad
POST /cities
Content-Type: application/json

{
  "name": "Bogotá"
}

Response 201:
{
  "id": "a1b2c3d4-...",
  "name": "Bogotá",
  "createdAt": "2026-07-23T12:00:00.000Z"
}

### Listar ciudades
GET /cities?search=Bog

Response 200:
[
  { "id": "...", "name": "Bogotá", "createdAt": "..." },
  { "id": "...", "name": "Bogotá D.C.", "createdAt": "..." }
]

### Obtener ciudad por ID
GET /cities/a1b2c3d4-...

Response 200:
{ "id": "...", "name": "Bogotá", "createdAt": "..." }

Response 404:
{ "statusCode": 404, "message": "Ciudad con id \"abc\" no encontrada", "timestamp": "..." }

### Actualizar ciudad
PATCH /cities/a1b2c3d4-...
Content-Type: application/json

{
  "name": "Bogotá D.C."
}

Response 200:
{ "id": "...", "name": "Bogotá D.C.", "createdAt": "..." }

### Eliminar ciudad
DELETE /cities/a1b2c3d4-...

Response 200:
{ "id": "...", "name": "Bogotá D.C.", "createdAt": "..." }
```

### 15.2 Services

```http
### Crear servicio
POST /services
Content-Type: application/json

{
  "name": "Limpieza General",
  "description": "Limpieza completa de hogar",
  "type": "GENERAL",
  "duration": 120
}

Response 201:
{
  "id": "...",
  "name": "Limpieza General",
  "description": "Limpieza completa de hogar",
  "type": "GENERAL",
  "duration": 120,
  "createdAt": "2026-07-23T12:00:00.000Z"
}

Response 409:
{ "statusCode": 409, "message": "El servicio \"Limpieza General\" ya existe", "timestamp": "..." }

### Listar servicios
GET /services?search=Limpieza&type=DEEP

Response 200:
[{ "id": "...", "name": "Limpieza Profunda", "type": "DEEP", "duration": 240, ... }]
```

### 15.3 Providers

```http
### Crear provider
POST /providers
Content-Type: application/json

{
  "name": "Juan Pérez",
  "phone": "+573001234567",
  "email": "juan@email.com",
  "cityId": "a1b2c3d4-..."
}

Response 201:
{
  "id": "...",
  "name": "Juan Pérez",
  "phone": "+573001234567",
  "email": "juan@email.com",
  "rating": 0,
  "reviews": 0,
  "isAvailable": true,
  "cityId": "a1b2c3d4-...",
  "city": { "id": "...", "name": "Bogotá" },
  "createdAt": "...",
  "updatedAt": "..."
}

### Listar providers
GET /providers?search=Juan&isAvailable=true&cityId=a1b2c3d4-...

Response 200:
[{ "id": "...", "name": "Juan Pérez", "isAvailable": true, "city": { ... }, ... }]
```

### 15.4 Clients

```http
### Crear cliente
POST /clients
Content-Type: application/json

{
  "name": "Carlos López",
  "phone": "+573009876543"
}

Response 201:
{
  "id": "...",
  "name": "Carlos López",
  "phone": "+573009876543",
  "email": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 15.5 Bookings

```http
### Crear reserva
POST /bookings
Content-Type: application/json

{
  "clientId": "client-uuid",
  "providerId": "provider-uuid",
  "serviceId": "service-uuid",
  "scheduledAt": "2026-08-01T14:00:00Z",
  "address": "Calle 123 #45-67",
  "notes": "Dejar llaves en portería",
  "totalPrice": 150000
}

Response 201:
{
  "id": "booking-uuid",
  "status": "PENDING",
  "scheduledAt": "2026-08-01T14:00:00.000Z",
  "address": "Calle 123 #45-67",
  "notes": "Dejar llaves en portería",
  "totalPrice": 150000,
  "client": { "id": "...", "name": "Carlos López", "phone": "+573009876543" },
  "provider": { "id": "...", "name": "Juan Pérez", "phone": "+573001234567" },
  "service": { "id": "...", "name": "Limpieza General", "type": "GENERAL" },
  "createdAt": "...",
  "updatedAt": "..."
}

Response 404:
{ "statusCode": 404, "message": "Cliente con id \"client-uuid\" no encontrado", "timestamp": "..." }

### Listar reservas
GET /bookings?status=PENDING&clientId=client-uuid

Response 200:
[{ "id": "...", "status": "PENDING", "scheduledAt": "...", "client": {...}, ... }]

### Actualizar estado de reserva
PATCH /bookings/booking-uuid
Content-Type: application/json

{
  "status": "CONFIRMED"
}

Response 200:
{ "id": "...", "status": "CONFIRMED", ... }
```

### 15.6 SMS / OTP

```http
### Enviar OTP
POST /sms/otp/send
Content-Type: application/json

{
  "phone": "+573001234567"
}

Response 201:
{
  "message": "Código enviado exitosamente"
}

Response 400:
{ "statusCode": 400, "message": ["phone must be a valid international format"], "timestamp": "..." }

### Verificar OTP
POST /sms/otp/verify
Content-Type: application/json

{
  "phone": "+573001234567",
  "code": "123456"
}

Response 201:
{
  "message": "Código verificado exitosamente"
}

Response 400 (código incorrecto):
{ "statusCode": 400, "message": "Código incorrecto.", "timestamp": "..." }

Response 400 (máximos intentos):
{ "statusCode": 400, "message": "Demasiados intentos fallidos. Solicite un nuevo código.", "timestamp": "..." }
```

---

## 16. Guía de Diseño de Endpoints

### 16.1 Principios REST

1. **Recursos, no acciones** — `/cities` (recurso) no `/getCities` (acción).
2. **Métodos HTTP semánticos** — POST=crear, GET=leer, PATCH=actualizar, DELETE=eliminar.
3. **Stateless** — Cada petición contiene toda la información necesaria.
4. **Idempotencia** — GET, PATCH, DELETE múltiples veces debe tener el mismo efecto.

### 16.2 Creación de Nuevos Endpoints

Al crear un nuevo endpoint, seguir esta plantilla:

```typescript
// 1. Definir el path (plural, kebab)
@Controller('nuevo-recurso')

// 2. Definir DTOs
// dto/create-nuevo-recurso.dto.ts
// dto/update-nuevo-recurso.dto.ts
// dto/query-nuevo-recurso.dto.ts

// 3. Definir servicio con 5 métodos CRUD
// nuevo-recurso.service.ts

// 4. Definir controlador con 5 endpoints + Swagger
// nuevo-recurso.controller.ts
```

### 16.3 Acciones No CRUD

Para acciones que no son CRUD estándar:

```
POST /{recurso}/:id/{accion}      — Acción sobre un recurso existente
POST /sms/otp/send                — Acción que no corresponde a CRUD
```

Ejemplos:

```
POST  /bookings/:id/confirm       — Confirmar reserva
POST  /bookings/:id/cancel        — Cancelar reserva
POST  /sms/otp/send               — Enviar OTP
```

### 16.4 Relaciones

Para acceder a recursos relacionados:

```http
# Preferido — filtro por query param
GET /bookings?clientId=uuid

# Alternativa — subrecurso (usar solo si hay muchos)
GET /clients/:clientId/bookings
```

**Regla:** Preferir query params sobre subrecursos. Los subrecursos se usan solo cuando el recurso anidado es el foco principal de la navegación.

---

*Documento de convenciones de API — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
