# Database Guidelines — Cleaning App

## Platform

- **Provider**: Neon (serverless PostgreSQL)
- **ORM**: Prisma v6
- **Connection**: `DATABASE_URL` (pooled) + `DIRECT_URL` (direct, for migrations)

## Schema Location

`backend/prisma/schema.prisma`

## Current Models

| Model | Key Fields | Uniques | Indexes |
|-------|-----------|---------|---------|
| `City` | id, name, createdAt | name | — |
| `Client` | id, name, phone, email?, createdAt, updatedAt | phone | — |
| `Provider` | id, name, phone, email?, description?, rating, reviews, isAvailable, lat/lng?, cityId, createdAt, updatedAt | phone | cityId, isAvailable, rating |
| `Service` | id, name, description?, type (enum), duration, createdAt | name | — |
| `ProviderService` | providerId, serviceId, price | (composite PK) | — |
| `Booking` | id, clientId, providerId, serviceId, status (enum), scheduledAt, address, notes?, totalPrice, createdAt, updatedAt | — | status, clientId, providerId, serviceId, scheduledAt |
| `Review` | id, bookingId (unique), rating, comment?, createdAt | bookingId | — |
| `Otp` | id, phone, code, expiresAt, verified, attempts, createdAt | — | phone |

## Enums

| Enum | Values |
|------|--------|
| `BookingStatus` | PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED |
| `ServiceType` | GENERAL, DEEP, CARPET, WINDOW, OFFICE |

## Conventions for New Models

### ID Field

```prisma
id String @id @default(uuid())
```

Always use `uuid()` (not autoincrement).

### Timestamps

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt  // Only if mutable
```

### Optional Fields

```prisma
fieldName String?
```

### Unique Constraints

```prisma
fieldName String @unique
```

### Indexes

Add indexes on:
- Foreign keys used in `where` clauses
- Fields used for filtering (status, isAvailable)
- Fields used for sorting (rating, scheduledAt)

```prisma
@@index([fieldName])
```

### Relations

```prisma
parentId  String
parent    ParentModel @relation(fields: [parentId], references: [id])
```

Always use explicit relation fields (not implicit).

### Cascade Delete

Only when the related entity has no meaning without the parent:

```prisma
onDelete: Cascade
```

## Migration Workflow

1. Edit `schema.prisma`
2. Run `npm run prisma:generate` to update Prisma Client types
3. Run `npm run prisma:migrate` to generate and apply migration SQL
4. Restart the dev server

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Model names | PascalCase, singular | `City`, `BookingStatus` |
| Field names | camelCase | `clientId`, `scheduledAt` |
| Enum names | PascalCase | `BookingStatus`, `ServiceType` |
| Enum values | UPPER_SNAKE_CASE | `IN_PROGRESS`, `DEEP` |
| Relation fields | camelCase, singular | `client`, `provider` |
| Foreign key fields | camelCase + Id suffix | `clientId`, `cityId` |
| Composite relation | Use `@@id([field1, field2])` | `ProviderService` |

## Query Patterns

### Find by unique field

```typescript
this.prisma.city.findUnique({ where: { name: dto.name } });
```

### Find with filters

```typescript
this.prisma.provider.findMany({
  where: {
    name: { contains: query.search, mode: 'insensitive' },
    isAvailable: true,
    cityId: 'some-id',
  },
  orderBy: { name: 'asc' },
  include: { city: true },
});
```

### Create with relations

```typescript
this.prisma.booking.create({
  data: {
    clientId: dto.clientId,
    providerId: dto.providerId,
    serviceId: dto.serviceId,
    scheduledAt: new Date(dto.scheduledAt),
    totalPrice: dto.totalPrice,
  },
  include: { client: true, provider: true, service: true },
});
```

### Update specific fields

```typescript
const data: any = {};
if (dto.status !== undefined) data.status = dto.status;
if (dto.notes !== undefined) data.notes = dto.notes;
```
