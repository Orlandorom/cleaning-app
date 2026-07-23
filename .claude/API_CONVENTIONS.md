# API Conventions — Cleaning App

## Base URL

```
http://localhost:3000/
```

All endpoints are prefixed by the module name (e.g., `/cities`, `/services`, `/providers`, `/clients`, `/bookings`, `/sms`).

## Authentication

Not yet implemented. When built, authentication will use **Bearer JWT tokens** via the `@nestjs/passport` + `passport-jwt` strategy. The Swagger config already includes `.addBearerAuth()`.

## Swagger Documentation

- **URL**: `/api/docs`
- **Framework**: `@nestjs/swagger` v11 + `swagger-ui-express`
- Every endpoint, DTO, and query parameter is documented with `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiProperty`, `@ApiPropertyOptional`.

## Standard CRUD Endpoints

Every CRUD module implements exactly these 5 endpoints:

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| `POST` | `/{module}` | Create | `CreateDto` (body) | Created entity (201) |
| `GET` | `/{module}` | List all | `QueryDto` (query params) | Entity[] (200) |
| `GET` | `/{module}/:id` | Get by ID | — | Entity (200) or 404 |
| `PATCH` | `/{module}/:id` | Update | `UpdateDto` (body) | Updated entity (200) or 404/409 |
| `DELETE` | `/{module}/:id` | Delete | — | Deleted entity (200) or 404 |

## Request & Response Format

### Request

- Create/Update: `Content-Type: application/json`
- Query parameters used for filtering, searching, and pagination (future).

### Response (Success)

```json
{
  "id": "uuid-here",
  "name": "Bogotá",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

- Related entities are included via Prisma `include`:
  ```json
  {
    "id": "booking-uuid",
    "client": { "id": "...", "name": "Carlos" },
    "provider": { "id": "...", "name": "Juan" },
    "service": { "id": "...", "name": "Limpieza general" }
  }
  ```

### Response (Error)

```json
{
  "statusCode": 404,
  "message": "Ciudad con id \"invalid-id\" no encontrada",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

- Validation errors (400): `message` contains an array of error strings from `class-validator`.
- All errors are caught by `AllExceptionsFilter` and return this consistent shape.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Module paths | Plural, lowercase | `/cities`, `/providers` |
| DTO classes | PascalCase with suffix | `CreateCityDto`, `UpdateCityDto` |
| Service methods | camelCase | `findAll`, `findOne` |
| Controller methods | camelCase | `create`, `findAll`, `findOne`, `update`, `remove` |
| Query params | camelCase | `?search=Bog&isAvailable=true` |
| JSON fields | camelCase | `clientId`, `totalPrice` |

## Specific Modules

### Cities

| Endpoint | Query Params |
|---------|-------------|
| `GET /cities` | `?search=` (partial name, case-insensitive) |

### Services

| Endpoint | Query Params |
|---------|-------------|
| `GET /services` | `?search=&type=` (GENERAL, DEEP, CARPET, WINDOW, OFFICE) |

### Providers

| Endpoint | Query Params |
|---------|-------------|
| `GET /providers` | `?search=&isAvailable=&cityId=` |

### Clients

| Endpoint | Query Params |
|---------|-------------|
| `GET /clients` | `?search=` (partial name) |

### Bookings

| Endpoint | Query Params |
|---------|-------------|
| `GET /bookings` | `?clientId=&providerId=&status=` (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED) |

### SMS

| Endpoint | Body | Description |
|---------|------|-------------|
| `POST /sms/otp/send` | `{ phone }` | Send verification code |
| `POST /sms/otp/verify` | `{ phone, code }` | Verify code |

## Sorting

- By default, collections are sorted ascending by `name` (Cities, Services, Providers, Clients).
- Bookings are sorted descending by `scheduledAt` (most recent first).

## Pagination

Not yet implemented. Pagination will be added when the frontend requires it, using `take`/`skip` query parameters.
