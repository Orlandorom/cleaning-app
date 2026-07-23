# Database Guidelines — Cleaning App

> Documentación completa de la base de datos: modelos, relaciones, enums, convenciones, índices, migraciones, seeds y buenas prácticas Prisma.

---

## Índice

1. [Plataforma y Configuración](#1-plataforma-y-configuración)
2. [Estrategia Neon](#2-estrategia-neon)
3. [Modelo de Datos — Diagrama ER](#3-modelo-de-datos--diagrama-er)
4. [Modelos Detallados](#4-modelos-detallados)
5. [Enums](#5-enums)
6. [Relaciones](#6-relaciones)
7. [Índices](#7-índices)
8. [Convenciones de Schema](#8-convenciones-de-schema)
9. [Migraciones](#9-migraciones)
10. [Seeds](#10-seeds)
11. [Buenas Prácticas Prisma](#11-buenas-prácticas-prisma)
12. [Patrones de Consulta](#12-patrones-de-consulta)
13. [Transacciones](#13-transacciones)
14. [Resolución de Problemas Comunes](#14-resolución-de-problemas-comunes)

---

## 1. Plataforma y Configuración

### 1.1 Stack de Base de Datos

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Motor | PostgreSQL (Neon Serverless) | 16 |
| ORM | Prisma | ^6.19.3 |
| Cliente | @prisma/client | ^6.19.3 |
| CLI | prisma (devDependency) | ^6.19.3 |
| Conexión | Pooled (queries) + Direct (migraciones) | — |

### 1.2 Archivo de Schema

```
backend/prisma/schema.prisma  ← Único source of truth
```

### 1.3 Configuración de Conexión

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled — para queries de la app
  directUrl = env("DIRECT_URL")         // Direct — para migraciones
}
```

### 1.4 Variables de Entorno

```env
# Pooled — conexión compartida para la aplicación (recommendada para queries)
DATABASE_URL="postgresql://user:password@ep-name-pooler.region.aws.neon.tech/db?sslmode=require"

# Direct — conexión directa para migraciones (requerida por Neon)
DIRECT_URL="postgresql://user:password@ep-name.region.aws.neon.tech/db?sslmode=require&channel_binding=require"
```

### 1.5 Comandos Esenciales

```bash
# Regenerar el cliente Prisma después de cambiar el schema
npx prisma generate

# Crear y aplicar una migración en desarrollo
npx prisma migrate dev --name descripcion_del_cambio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Ver el estado de las migraciones
npx prisma migrate status

# Abrir Prisma Studio (UI para explorar datos)
npx prisma studio

# Validar el schema (sin generar cliente)
npx prisma validate
```

---

## 2. Estrategia Neon

### 2.1 ¿Qué es Neon?

Neon es una plataforma **PostgreSQL serverless** que separa almacenamiento y cómputo. Se pausa automáticamente cuando no hay actividad (free tier) y escala a demanda.

### 2.2 Pooled vs Direct

| Tipo | URL | Propósito | Características |
|------|-----|-----------|-----------------|
| **Pooled** | `*-pooler.region.neon.tech` | Queries de la aplicación | Pool de conexiones, recomendado para producción |
| **Direct** | `*.region.neon.tech` | Migraciones (prisma migrate) | Conexión directa, requerida por Prisma Migrate |

**Regla:** Usar `DATABASE_URL` (pooled) para la aplicación y `DIRECT_URL` (direct) para migraciones.

### 2.3 Branches (Ramificaciones)

Neon permite crear **branches** de la base de datos (como ramas de git):

```
main branch (producción)
├── staging branch (pre-producción)
├── dev branch (desarrollo)
└── feature/xxx branch (por feature)
```

**Uso recomendado:**
- `main` — Producción.
- `dev` — Desarrollo local/colaborativo.
- `staging` — Pruebas de integración y QA.
- Branch por PR — Tests automatizados.

### 2.4 Cold Starts

Neon pausa la base de datos después de **5 minutos de inactividad** (free tier). Al recibir la primera query, tarda **1-3 segundos** en reanudarse (cold start).

**Impacto en desarrollo:** La primera petición después de un periodo de inactividad será más lenta. Es normal.

**Solución para producción:** Upgrade a plan que no pause o mantener una conexión keep-alive.

### 2.5 SSL

Todas las conexiones a Neon requieren `sslmode=require`. Ya está configurado en las URLs de conexión.

### 2.6 Pooler

Neon proporciona un pooler de conexiones incorporado. La URL pooled (`*-pooler`) debe usarse en producción para evitar el límite de conexiones del plan gratuito.

---

## 3. Modelo de Datos — Diagrama ER

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MODELOS Y RELACIONES                         │
│                                                                     │
│  ┌────────────┐       ┌────────────────┐                            │
│  │    City     │       │    Client       │                            │
│  ├────────────┤       ├────────────────┤                            │
│  │ id (PK)    │       │ id (PK)         │                            │
│  │ name (U)   │       │ name            │                            │
│  │ createdAt  │       │ phone (U)       │                            │
│  └─────┬──────┘       │ email ?         │                            │
│        │              │ createdAt       │                            │
│        │ 1:N          │ updatedAt       │                            │
│        │              └────────┬───────┘                            │
│        ▼                       │ 1:N                                 │
│  ┌────────────┐               │                                     │
│  │  Provider   │               │                                     │
│  ├────────────┤               │                                     │
│  │ id (PK)    │               │                                     │
│  │ name       │               │                                     │
│  │ phone (U)  │               │                                     │
│  │ email ?    │               │                                     │
│  │ desc. ?    │               │                                     │
│  │ rating     │               │                                     │
│  │ reviews    │               │                                     │
│  │ isAvailable│               │                                     │
│  │ lat ?      │               │                                     │
│  │ lng ?      │               │                                     │
│  │ cityId (FK)│───────────────┼───┐                                 │
│  │ createdAt  │               │   │                                 │
│  │ updatedAt  │               │   │                                 │
│  └─────┬──────┘               │   │                                 │
│        │ 1:N                  │   │                                 │
│        ▼                      ▼   ▼                                 │
│  ┌─────────────────────────────────────┐                            │
│  │              Booking                 │                            │
│  ├─────────────────────────────────────┤                            │
│  │ id (PK)                             │                            │
│  │ clientId (FK) ──────────────────────┘                            │
│  │ providerId (FK) ────────────────────┘                            │
│  │ serviceId (FK) ────────────────────┐                             │
│  │ status (enum BookingStatus)        │                             │
│  │ scheduledAt                        │                             │
│  │ address                            │                             │
│  │ notes ?                            │                             │
│  │ totalPrice                         │                             │
│  │ createdAt                          │                             │
│  │ updatedAt                          │                             │
│  └─────────┬──────────────────────────┘                             │
│            │ 1:1                                                     │
│            ▼                                                        │
│  ┌────────────────┐        ┌────────────────┐                       │
│  │     Review      │        │    Service       │                     │
│  ├────────────────┤        ├────────────────┤                       │
│  │ id (PK)         │        │ id (PK)         │                       │
│  │ bookingId (U,FK)│        │ name (U)        │                       │
│  │ rating          │        │ description ?   │                       │
│  │ comment ?       │        │ type (enum)     │                       │
│  │ createdAt       │        │ duration        │                       │
│  └────────────────┘        │ createdAt       │                       │
│                             └────────────────┘                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐           │
│  │              ProviderService (N:N)                    │           │
│  ├──────────────────────────────────────────────────────┤           │
│  │ providerId (PK,FK) ──── Provider                     │           │
│  │ serviceId (PK,FK) ───── Service                      │           │
│  │ price                                                │           │
│  └──────────────────────────────────────────────────────┘           │
│                                                                     │
│  ┌────────────────────────────────────────┐                         │
│  │              Otp                         │                         │
│  ├────────────────────────────────────────┤                         │
│  │ id (PK)                                 │                         │
│  │ phone                                   │                         │
│  │ code                                    │                         │
│  │ expiresAt                               │                         │
│  │ verified                                │                         │
│  │ attempts                                │                         │
│  │ createdAt                               │                         │
│  └────────────────────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────────┘

Notación: (PK) = Primary Key, (FK) = Foreign Key, (U) = Unique, ? = Opcional
```

---

## 4. Modelos Detallados

### 4.1 City

```prisma
model City {
  id        String     @id @default(uuid())    // UUID v4, autogenerado
  name      String     @unique                 // Nombre de la ciudad, único
  createdAt DateTime   @default(now())         // Fecha de creación automática

  providers Provider[]                          // Relación 1:N con Provider
}
```

**Propósito:** Catálogo de ciudades donde opera la plataforma.

**Reglas de negocio:**
- No pueden existir dos ciudades con el mismo nombre (unique constraint).
- Una ciudad puede tener múltiples prestadores.
- Las ciudades se listan en orden alfabético por nombre.

### 4.2 Client

```prisma
model Client {
  id        String     @id @default(uuid())
  name      String                              // Nombre completo
  phone     String     @unique                  // Teléfono en formato internacional (+57...)
  email     String?                             // Email opcional
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt               // Se actualiza automáticamente

  bookings  Booking[]                            // Relación 1:N con Booking
}
```

**Propósito:** Usuarios que contratan servicios de limpieza.

**Reglas de negocio:**
- El teléfono es único (identificador principal, no el email).
- El teléfono se verifica vía OTP antes de poder crear reservas.

### 4.3 Provider

```prisma
model Provider {
  id          String     @id @default(uuid())
  name        String                              // Nombre completo o empresa
  phone       String     @unique                  // Teléfono único
  email       String?                             // Email opcional
  description String?                             // Descripción del servicio ofrecido

  rating     Float      @default(0)               // Calificación promedio (0-5)
  reviews    Int        @default(0)               // Cantidad total de reseñas

  isAvailable Boolean    @default(true)            // Disponible para nuevas reservas

  latitude   Float?                               // Latitud de ubicación (-90 a 90)
  longitude  Float?                               // Longitud (-180 a 180)

  cityId     String                               // FK a City
  city       City       @relation(fields: [cityId], references: [id])

  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  services   ProviderService[]                     // Servicios que ofrece (N:N con Service)
  bookings   Booking[]                             // Reservas asignadas

  @@index([cityId])                                // Índice para filtrar por ciudad
  @@index([isAvailable])                           // Índice para filtrar por disponibilidad
  @@index([rating])                                // Índice para ordenar por calificación
}
```

**Propósito:** Profesionales independientes que ofrecen servicios de limpieza.

**Reglas de negocio:**
- El teléfono es único.
- `rating` y `reviews` se actualizan automáticamente al crear/eliminar reseñas.
- `isAvailable` permite a los prestadores pausar la recepción de nuevas reservas.
- La ubicación (lat/lng) es opcional y se usa para búsqueda geográfica futura.

### 4.4 Service

```prisma
model Service {
  id          String      @id @default(uuid())
  name        String      @unique                 // Nombre del servicio
  description String?                             // Descripción detallada
  type        ServiceType                          // Tipo de servicio (enum)
  duration    Int                                 // Duración estimada en minutos

  createdAt   DateTime    @default(now())

  providers   ProviderService[]                    // Prestadores que lo ofrecen (N:N)
  bookings    Booking[]                            // Reservas de este servicio
}
```

**Propósito:** Catálogo de servicios de limpieza disponibles en la plataforma.

**Reglas de negocio:**
- El nombre es único (no pueden haber dos servicios con el mismo nombre).
- `duration` es en minutos, mínimo 15.
- `type` define la categoría del servicio (GENERAL, DEEP, CARPET, WINDOW, OFFICE).

### 4.5 ProviderService (Tabla Pivote N:N)

```prisma
model ProviderService {
  providerId String
  serviceId  String

  price Float                                    // Precio del servicio para este provider

  provider Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  service  Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@id([providerId, serviceId])                   // Primary Key compuesta
}
```

**Propósito:** Relacionar prestadores con los servicios que ofrecen, cada uno con su propio precio.

**Reglas de negocio:**
- Un prestador no puede tener el mismo servicio dos veces (PK compuesta lo impide).
- `price` debe ser mayor a 0.
- Cascade delete: si se elimina un provider o service, la asignación se elimina automáticamente.

### 4.6 Booking

```prisma
model Booking {
  id String @id @default(uuid())

  clientId   String
  providerId String
  serviceId  String

  status     BookingStatus @default(PENDING)      // Estado actual de la reserva

  scheduledAt DateTime                             // Fecha y hora programada
  address    String                               // Dirección donde se presta el servicio
  notes      String?                              // Notas adicionales del cliente
  totalPrice Float                                // Precio total acordado

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  client   Client   @relation(fields: [clientId], references: [id])
  provider Provider @relation(fields: [providerId], references: [id])
  service  Service  @relation(fields: [serviceId], references: [id])

  review Review?                                   // Relación 1:1 con Review (opcional)

  @@index([status])                                // Filtrar por estado
  @@index([clientId])                              // Buscar reservas de un cliente
  @@index([providerId])                            // Buscar reservas de un prestador
  @@index([serviceId])                             // Buscar reservas de un servicio
  @@index([scheduledAt])                           // Ordenar por fecha
}
```

**Propósito:** Representa una reserva de servicio entre un cliente y un prestador.

**Ciclo de vida del estado:**

```
PENDING ──▶ CONFIRMED ──▶ IN_PROGRESS ──▶ COMPLETED
    │            │
    └──▶ CANCELLED ┘
```

**Reglas de negocio:**
- Una reserva requiere cliente, prestador y servicio existentes (FK constraints).
- `status` sigue el flujo definido (no se puede saltar estados).
- `totalPrice` no puede ser negativo.
- Una reserva puede tener 0 o 1 review (relación 1:1 opcional).

### 4.7 Review

```prisma
model Review {
  id String @id @default(uuid())

  bookingId String @unique                        // FK única: una review por booking

  rating  Int                                     // Calificación 1-5
  comment String?                                 // Comentario opcional

  createdAt DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}
```

**Propósito:** Reseña y calificación de un servicio completado.

**Reglas de negocio:**
- Solo una review por booking (`bookingId` es `@unique`).
- `rating` es un entero entre 1 y 5.
- Solo se puede reseñar un booking en estado `COMPLETED`.
- Cascade delete: si se elimina el booking, se elimina la review.

### 4.8 Otp

```prisma
model Otp {
  id        String   @id @default(uuid())
  phone     String                               // Teléfono al que se envió el código
  code      String                               // Código de 6 dígitos (generado con crypto)
  expiresAt DateTime                             // Fecha de expiración (now + 10 min)
  verified  Boolean  @default(false)              // Si fue verificado exitosamente
  attempts  Int      @default(0)                  // Intentos de verificación fallidos
  createdAt DateTime @default(now())

  @@index([phone])                                // Buscar OTPs por teléfono
}
```

**Propósito:** Almacenar códigos OTP para verificación telefónica.

**Reglas de negocio:**
- El código se genera con `crypto.randomInt(100000, 999999)` (6 dígitos).
- `expiresAt` = `Date.now() + 10 minutos`.
- Máximo 5 intentos de verificación por código (`attempts >= 5` → bloqueado).
- Se buscan OTPs no expirados y no verificados por número de teléfono.
- Los OTPs expirados y verificados se pueden eliminar periódicamente (cleanup).

---

## 5. Enums

### 5.1 BookingStatus

```prisma
enum BookingStatus {
  PENDING        // Reserva creada, esperando confirmación del prestador
  CONFIRMED      // Prestador aceptó la reserva
  IN_PROGRESS    // Servicio en ejecución
  COMPLETED      // Servicio finalizado
  CANCELLED      // Reserva cancelada (por cliente o prestador)
}
```

**Transiciones permitidas:**

| Desde | Hacia | Quién |
|-------|-------|-------|
| PENDING | CONFIRMED | Prestador |
| PENDING | CANCELLED | Cliente o Prestador |
| CONFIRMED | IN_PROGRESS | Prestador |
| CONFIRMED | CANCELLED | Cliente o Prestador |
| IN_PROGRESS | COMPLETED | Prestador |

**Transiciones NO permitidas:**
- PENDING → IN_PROGRESS (debe pasar por CONFIRMED)
- PENDING → COMPLETED (debe pasar por CONFIRMED e IN_PROGRESS)
- IN_PROGRESS → CANCELLED (una vez iniciado, no se puede cancelar)
- COMPLETED → cualquier otro estado (terminal)

### 5.2 ServiceType

```prisma
enum ServiceType {
  GENERAL    // Limpieza general de hogar/oficina
  DEEP       // Limpieza profunda (incluye alfombras, ventanas, etc.)
  CARPET     // Limpieza especializada de alfombras
  WINDOW     // Limpieza de ventanas y vidrios
  OFFICE     // Limpieza de oficinas y espacios comerciales
}
```

### 5.3 Uso de Enums en TypeScript

```typescript
// Los enums de Prisma se importan directamente desde @prisma/client
import { BookingStatus, ServiceType } from '@prisma/client';

// En DTOs con class-validator:
@IsEnum(BookingStatus)
status: BookingStatus;

// En Swagger:
@ApiProperty({ enum: BookingStatus })

// En queries:
where: { status: BookingStatus.PENDING }

// En valores del enum (string):
'PENDING'    // También funciona porque Prisma enums son strings
```

---

## 6. Relaciones

### 6.1 Tipos de Relaciones

| Tipo | Modelos | Campo | Descripción |
|------|---------|-------|-------------|
| **1:N** | City → Provider | `cityId` en Provider | Una ciudad tiene muchos prestadores |
| **1:N** | Client → Booking | `clientId` en Booking | Un cliente tiene muchas reservas |
| **1:N** | Provider → Booking | `providerId` en Booking | Un prestador tiene muchas reservas |
| **1:N** | Service → Booking | `serviceId` en Booking | Un servicio tiene muchas reservas |
| **N:N** | Provider ↔ Service | ProviderService (pivote) | Prestadores ofrecen múltiples servicios |
| **1:1** | Booking → Review | `bookingId` en Review (unique) | Una reserva tiene una reseña |

### 6.2 Convenciones de Nombres para Relaciones

```prisma
// FK field: camelCase + Id
cityId String

// Relation field: camelCase, singular o plural según cardinalidad
city   City   @relation(fields: [cityId], references: [id])

// Relación inversa: plural si es 1:N, singular si es 1:1
providers Provider[]     // City.providers (plural)
bookings  Booking[]      // Client.bookings (plural)
review    Review?        // Booking.review (singular, opcional)
```

### 6.3 Cascade Delete

```prisma
// ProviderService: si se elimina el provider o service, se elimina la asignación
onDelete: Cascade

// Review: si se elimina el booking, se elimina la reseña
onDelete: Cascade
```

**Regla:** Solo usar `onDelete: Cascade` cuando la entidad hija no tiene sentido sin la padre.
- Una `ProviderService` no existe sin un `Provider` o `Service`.
- Una `Review` no existe sin un `Booking`.

**NO usar cascade en:**
- `Booking` cuando se elimina `Client` (las reservas deben conservarse para auditoría).
- `Provider` cuando se elimina `City` (una ciudad no se elimina si tiene prestadores activos).

### 6.4 Relaciones Explícitas vs Implícitas

```prisma
// ✅ CORRECTO — relación explícita (siempre)
providerId String
provider   Provider @relation(fields: [providerId], references: [id])

// ❌ INCORRECTO — relación implícita
provider Provider @relation()  // No se declara el campo FK explícitamente
```

**Regla:** Siempre declarar el campo FK explícitamente (`providerId: String` + `@relation(fields: [...], references: [...])`). Esto permite acceder al FK directamente sin hacer JOIN.

---

## 7. Índices

### 7.1 Índices Actuales

| Modelo | Índice | Tipo | Propósito |
|--------|--------|------|-----------|
| `Provider` | `cityId` | B-tree | Filtrar prestadores por ciudad |
| `Provider` | `isAvailable` | B-tree | Filtrar prestadores disponibles |
| `Provider` | `rating` | B-tree | Ordenar prestadores por calificación |
| `Booking` | `status` | B-tree | Filtrar reservas por estado |
| `Booking` | `clientId` | B-tree | Buscar reservas de un cliente |
| `Booking` | `providerId` | B-tree | Buscar reservas de un prestador |
| `Booking` | `serviceId` | B-tree | Buscar reservas de un servicio |
| `Booking` | `scheduledAt` | B-tree | Ordenar reservas por fecha |
| `Otp` | `phone` | B-tree | Buscar OTPs por teléfono |

### 7.2 Reglas para Agregar Índices

Agregar un índice cuando:

1. **El campo se usa en `where`** con alta frecuencia (ej: `status`, `isAvailable`).
2. **El campo se usa en `orderBy`** (ej: `rating`, `scheduledAt`).
3. **El campo es FK** usado en JOINs frecuentes (ej: `cityId`, `clientId`).

NO agregar índices cuando:

1. **La tabla tiene pocos registros** (< 1000).
2. **El campo tiene alta cardinalidad** pero se consulta con poca frecuencia.
3. **El índice ocuparía más espacio que los datos** (cada índice tiene costo de almacenamiento y escritura).

### 7.3 Índices Compuestos (Futuro)

Para consultas que filtran por múltiples campos simultáneamente, considerar índices compuestos:

```prisma
@@index([cityId, isAvailable])     // Prestadores disponibles en una ciudad
@@index([providerId, status])      // Reservas de un prestador por estado
@@index([clientId, status])        // Reservas de un cliente por estado
@@index([status, scheduledAt])     // Reservas por estado ordenadas por fecha
```

### 7.4 Sintaxis de Índices

```prisma
// Índice simple
@@index([fieldName])

// Índice compuesto (varios campos)
@@index([field1, field2])

// Índice con orden específico
@@index([fieldName(sort: Desc)])

// Índice único compuesto
@@unique([field1, field2])

// Índice sobre campo de relación
// (no se pone en el modelo — se indexa automáticamente la FK si se pone @@index)
```

---

## 8. Convenciones de Schema

### 8.1 Reglas de Formato

```prisma
// 1. Model names: PascalCase, singular
model City {}        // ✅
model Cities {}      // ❌ (plural)

// 2. Field names: camelCase
createdAt            // ✅
created_at           // ❌ (snake_case)

// 3. Enum names: PascalCase
enum BookingStatus {} // ✅

// 4. Enum values: UPPER_SNAKE_CASE
PENDING              // ✅
pending              // ❌
Pending              // ❌

// 5. IDs: uuid siempre
id String @id @default(uuid())  // ✅
id Int @id @default(autoincrement())  // ❌ (usar UUID)
```

### 8.2 Orden de Campos en un Modelo

```prisma
model Entity {
  // 1. ID (primero siempre)
  id String @id @default(uuid())

  // 2. Campos de datos (orden lógico: nombre, identificadores, detalles)
  name        String
  phone       String  @unique
  email       String?
  description String?

  // 3. Campos de negocio (estado, métricas)
  status      Status   @default(ACTIVE)
  rating      Float    @default(0)

  // 4. FK + Relación (juntos)
  cityId String
  city   City   @relation(fields: [cityId], references: [id])

  // 5. Timestamps (al final)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 6. Relaciones inversas (al final)
  bookings Booking[]

  // 7. Índices (al final, después de todo)
  @@index([status])
}
```

### 8.3 Opcionalidad

```prisma
// Obligatorio: sin ?
name String

// Opcional con ?
email String?

// Obligatorio con default
isAvailable Boolean @default(true)
```

### 8.4 Unicidad

```prisma
// Simple
@unique
name String @unique

// Compuesta (varios campos como única combinación)
@@unique([field1, field2])
```

### 8.5 Valores por Defecto

```prisma
id        String   @id @default(uuid())         // UUID autogenerado
createdAt DateTime @default(now())               // Fecha actual
updatedAt DateTime @updatedAt                    // Se actualiza automáticamente
rating    Float    @default(0)                   // Número con decimal
reviews   Int      @default(0)                   // Entero
verified  Boolean  @default(false)               // Booleano
attempts  Int      @default(0)                   // Contador
```

### 8.6 Ubicación de Nuevos Modelos

Agregar **siempre al final** del archivo, después del último modelo existente.

```prisma
// ... modelos existentes ...

model Otp {
  // ...
}

// <<< NUEVO MODELO AQUÍ >>>
model NewFeature {
  id String @id @default(uuid())
  // ...
}
```

---

## 9. Migraciones

### 9.1 Flujo de Trabajo

```bash
# 1. Editar schema.prisma
# (agregar/quitar modelos, campos, índices)

# 2. Validar el schema
npx prisma validate

# 3. Generar el cliente Prisma (siempre después de cambios)
npx prisma generate

# 4. Crear y aplicar migración
npx prisma migrate dev --name agregar_modelo_otp
# Esto:
#   a. Compara el schema actual con el estado anterior
#   b. Genera SQL de migración
#   c. Aplica a la base de datos
#   d. Crea o actualiza el archivo de migración

# 5. Commitear la migración
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add Otp model"
```

### 9.2 Nombres de Migraciones

Usar nombres descriptivos en español:

```bash
npx prisma migrate dev --name agregar_modelo_otp
npx prisma migrate dev --name agregar_role_a_client
npx prisma migrate dev --name agregar_indices_a_booking
```

### 9.3 Migraciones en Producción

```bash
# Aplicar migraciones pendientes (NUNCA usar migrate dev en prod)
npx prisma migrate deploy

# Verificar estado
npx prisma migrate status
```

**Regla:** `prisma migrate deploy` es el único comando de migración que se ejecuta en producción. `prisma migrate dev` es solo para desarrollo.

### 9.4 Resolución de Conflictos

Si la migración falla por datos existentes:

1. **Agregar campo opcional** primero (nullable).
2. Ejecutar migración.
3. Poblar datos.
4. Hacer campo obligatorio en una segunda migración.

```prisma
// Paso 1: Agregar como opcional
email String?

// Paso 2: Migrar
// Paso 3: Poblar datos faltantes con UPDATE
// Paso 4: Hacer obligatorio
email String
```

### 9.5 Reset de Base de Datos (Solo Desarrollo)

```bash
# Elimina datos y tablas, vuelve a crear todo
npx prisma migrate reset
```

**Advertencia:** Esto elimina TODOS los datos. No usar en producción.

---

## 10. Seeds

### 10.1 Archivo de Seed

```bash
backend/prisma/seed.ts
```

### 10.2 Configuración

```json
// package.json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 10.3 Contenido Sugerido del Seed

```typescript
// prisma/seed.ts
import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear ciudades
  const bogota = await prisma.city.create({ data: { name: 'Bogotá' } });
  const medellin = await prisma.city.create({ data: { name: 'Medellín' } });
  const cali = await prisma.city.create({ data: { name: 'Cali' } });
  const barranquilla = await prisma.city.create({ data: { name: 'Barranquilla' } });

  // Crear servicios
  const limpGeneral = await prisma.service.create({
    data: { name: 'Limpieza General', type: ServiceType.GENERAL, duration: 120 },
  });
  const limpProfunda = await prisma.service.create({
    data: { name: 'Limpieza Profunda', type: ServiceType.DEEP, duration: 240 },
  });

  // Crear un cliente de prueba
  await prisma.client.create({
    data: { name: 'Cliente Demo', phone: '+573001000000' },
  });

  // Crear un prestador de prueba
  const provider = await prisma.provider.create({
    data: {
      name: 'Prestador Demo',
      phone: '+573002000000',
      description: 'Profesional con 5 años de experiencia',
      cityId: bogota.id,
    },
  });

  // Asignar servicios al prestador
  await prisma.providerService.create({
    data: { providerId: provider.id, serviceId: limpGeneral.id, price: 80000 },
  });
  await prisma.providerService.create({
    data: { providerId: provider.id, serviceId: limpProfunda.id, price: 150000 },
  });

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

### 10.4 Ejecutar Seed

```bash
npx prisma db seed
```

### 10.5 Reglas para Seeds

1. **Idempotente:** Ejecutar múltiples veces no debe causar errores (usar `upsert` o verificar existencia antes de insertar).
2. **Datos de prueba realistas:** Usar nombres, teléfonos y direcciones creíbles.
3. **No incluir datos sensibles:** No usar contraseñas reales, tarjetas de crédito, etc.
4. **Ejecutar después de cada reset:** `prisma migrate reset` ejecuta el seed automáticamente.

---

## 11. Buenas Prácticas Prisma

### 11.1 Conexión (PrismaService)

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- El módulo es `@Global()` para que cualquier servicio pueda inyectar `PrismaService`.
- La conexión se establece al iniciar la aplicación y se cierra al detenerse.

### 11.2 Uso de Tipos Generados

```typescript
// ✅ Siempre usar tipos generados por Prisma
import { City, Prisma } from '@prisma/client';

// Retorno tipado
async findOne(id: string): Promise<City> {
  return this.prisma.city.findUnique({ where: { id } });
}

// Input tipado para queries
const where: Prisma.CityWhereInput = {};
const data: Prisma.CityCreateInput = { name: 'Bogotá' };
```

### 11.3 Select vs Include

```typescript
// ✅ include — cuando necesitas toda la relación
include: { city: true }

// ✅ select — cuando solo necesitas campos específicos (optimización)
select: { id: true, name: true }

// ❌ NO hacer fetch de todo si solo necesitas 2 campos
// (Prisma trae todos los campos por defecto si no usas select)
```

**Regla:** Usar `include` por defecto para mantener el código simple. Usar `select` solo cuando haya problemas de rendimiento.

### 11.4 N+1 Queries

```typescript
// ❌ N+1: Un query por cada provider + un query por cada ciudad
const providers = await this.prisma.provider.findMany();
for (const p of providers) {
  const city = await this.prisma.city.findUnique({ where: { id: p.cityId } });
}

// ✅ Solución con include: UN query
const providers = await this.prisma.provider.findMany({
  include: { city: true },
});
```

**Regla:** Siempre usar `include` para relaciones que se van a necesitar. Nunca iterar resultados para hacer queries adicionales.

### 11.5 Batch Operations

```typescript
// Crear múltiples registros
await this.prisma.providerService.createMany({
  data: [
    { providerId: '1', serviceId: '1', price: 80000 },
    { providerId: '1', serviceId: '2', price: 150000 },
  ],
});

// Actualizar múltiples registros
await this.prisma.booking.updateMany({
  where: { status: 'PENDING', scheduledAt: { lt: new Date() } },
  data: { status: 'CANCELLED' },
});
```

### 11.6 Soft Delete vs Hard Delete

```prisma
// HARD DELETE (actual): el registro se elimina físicamente
await this.prisma.city.delete({ where: { id } });

// SOFT DELETE (futuro si es necesario): agregar campo deletedAt
// deletedAt DateTime?
```

**Regla actual:** Usar hard delete. Si en el futuro se requiere auditoría de eliminaciones, migrar a soft delete agregando `deletedAt`.

### 11.7 Paginación

```typescript
// Con take + skip
const page = 1;
const limit = 10;
const [data, total] = await Promise.all([
  this.prisma.city.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { name: 'asc' },
  }),
  this.prisma.city.count(),  // ← Count separado para total de páginas
]);

return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
```

### 11.8 Logging de Queries

```typescript
// Activar logging en desarrollo
new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

**Regla:** No activar `query` log en producción (mucho ruido). Solo `warn` y `error`.

---

## 12. Patrones de Consulta

### 12.1 FindUnique (Por ID o Campo Único)

```typescript
// Por ID
this.prisma.city.findUnique({ where: { id } });

// Por campo único
this.prisma.client.findUnique({ where: { phone } });
```

### 12.2 FindMany (Listas con Filtros)

```typescript
// Filtros simples
this.prisma.booking.findMany({
  where: { status: 'PENDING' },
});

// Filtros combinados dinámicos
const where: Prisma.BookingWhereInput = {};
if (status) where.status = status;
if (clientId) where.clientId = clientId;

// Búsqueda case-insensitive
this.prisma.provider.findMany({
  where: { name: { contains: search, mode: 'insensitive' } },
});

// Fechas
this.prisma.booking.findMany({
  where: {
    scheduledAt: {
      gte: startDate,   // greater than or equal
      lte: endDate,      // less than or equal
    },
  },
});

// Incluir relaciones + ordenar
this.prisma.provider.findMany({
  where: { isAvailable: true },
  include: { city: true },
  orderBy: { rating: 'desc' },
});
```

### 12.3 FindFirst (Primer Registro)

```typescript
// Último OTP de un teléfono (ordenado por fecha descendente)
this.prisma.otp.findFirst({
  where: { phone, verified: false, expiresAt: { gt: new Date() } },
  orderBy: { createdAt: 'desc' },
});
```

### 12.4 Create

```typescript
// DTO directo (cuando el DTO coincide con el modelo)
this.prisma.city.create({ data: dto });

// Con transformaciones
this.prisma.booking.create({
  data: {
    ...dto,
    scheduledAt: new Date(dto.scheduledAt),  // Convertir string a Date
  },
  include: { client: true, provider: true, service: true },
});
```

### 12.5 Update

```typescript
// Actualizar campos específicos
this.prisma.provider.update({
  where: { id },
  data: { name: 'Nuevo nombre' },
});

// Incrementar contador
this.prisma.otp.update({
  where: { id: latest.id },
  data: { attempts: { increment: 1 } },
});
```

### 12.6 Delete

```typescript
// Hard delete
this.prisma.city.delete({ where: { id } });
```

### 12.7 Count

```typescript
const total = await this.prisma.booking.count({
  where: { status: 'PENDING' },
});
```

### 12.8 Upsert

```typescript
const city = await this.prisma.city.upsert({
  where: { name: 'Bogotá' },
  update: {},   // Si existe, no hacer nada
  create: { name: 'Bogotá' },  // Si no existe, crear
});
```

---

## 13. Transacciones

### 13.1 Transacciones Secuenciales

```typescript
// Múltiples operaciones como transacción
const [booking, notification] = await this.prisma.$transaction([
  this.prisma.booking.create({ data: { ... } }),
  this.prisma.notification.create({ data: { ... } }),
]);
```

### 13.2 Transacciones con Callback

```typescript
// Operaciones condicionales dentro de la transacción
await this.prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data: { ... } });

  if (someCondition) {
    await tx.review.create({ data: { ... } });
  }

  return booking;
});
```

**Regla:** Usar `$transaction` cuando una operación requiere múltiples escrituras que deben ser atómicas (ej: crear reserva + enviar notificación, o crear reseña + actualizar rating del provider).

---

## 14. Resolución de Problemas Comunes

### 14.1 Error: "Environment variable not found: DATABASE_URL"

```
Solución: Verificar que backend/.env existe y tiene DATABASE_URL configurada.
```

### 14.2 Error: "Can't reach database server"

```
Causa: Neon puede estar pausado (cold start) o la URL es incorrecta.
Solución: Esperar 2-3 segundos y reintentar. Verificar DATABASE_URL y DIRECT_URL.
```

### 14.3 Error: "The table does not exist"

```
Causa: Migraciones no aplicadas.
Solución: npx prisma migrate dev (desarrollo) o npx prisma migrate deploy (producción).
```

### 14.4 Error: "Foreign key constraint failed"

```
Causa: Intentar crear un registro con un FK que no existe.
Solución: Verificar que el registro referenciado existe antes de crear.
```

### 14.5 Error: "Unique constraint failed"

```
Causa: Intentar crear un registro con un valor duplicado en campo @unique.
Solución: Verificar unicidad antes de crear/actualizar (en el servicio).
```

### 14.6 Error: "PrismaClientKnownRequestError (P2025)"

```
Causa: update o delete en un registro que no existe.
Solución: Verificar existencia con findOne antes de update/delete.
```

### 14.7 Prisma Client desactualizado

```
Después de cambiar schema.prisma, siempre ejecutar:
npx prisma generate
```

### 14.8 Migración conflictiva después de git pull

```
Solución:
1. npx prisma migrate reset  (borra datos, solo dev)
2. npx prisma migrate dev    (recrea migraciones desde cero)
```

---

*Documento de guía de base de datos — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
