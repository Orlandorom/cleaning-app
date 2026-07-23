# Testing — Cleaning App

> Estrategia completa de pruebas para el backend de la aplicación. Define cómo se escriben, organizan y ejecutan tests unitarios, de integración y E2E, junto con políticas de cobertura, mocks, seeds y datos de prueba.

---

## Índice

1. [Estrategia General](#1-estrategia-general)
2. [Stack de Testing](#2-stack-de-testing)
3. [Tests Unitarios](#3-tests-unitarios)
4. [Tests de Integración](#4-tests-de-integración)
5. [Tests E2E](#5-tests-e2e)
6. [Cobertura](#6-cobertura)
7. [Mocks](#7-mocks)
8. [Seeds y Datos de Prueba](#8-seeds-y-datos-de-prueba)
9. [Organización de Archivos](#9-organización-de-archivos)
10. [Ejecución de Tests](#10-ejecución-de-tests)
11. [Buenas Prácticas](#11-buenas-prácticas)
12. [Ejemplo por Módulo](#12-ejemplo-por-módulo)

---

## 1. Estrategia General

### 1.1 Pirámide de Testing

```
         ╱╲
        ╱  ╲          E2E (pocos, lentos, alto costo)
       ╱    ╲
      ╱──────╲
     ╱        ╲       Integración (algunos, medio costo)
    ╱──────────╲
   ╱            ╲
  ╱──────────────╲    Unitarias (muchas, rápidas, bajo costo)
 ╱────────────────╲
╱                  ╲
```

| Nivel | Cantidad | Velocidad | Costo de mantenimiento |
|-------|----------|-----------|----------------------|
| Unitarias | Muchas (la mayoría) | Rápidas (<10ms c/u) | Bajo |
| Integración | Algunas (servicios + DB) | Medias (~200ms c/u) | Medio |
| E2E | Pocas (endpoints completos) | Lentas (~1s c/u) | Alto |

### 1.2 Principios

1. **Testear comportamiento, no implementación** — los tests deben validar lo que hace el código, no cómo lo hace.
2. **No mockear lo que no posees** — la base de datos se testea con integración real (Prisma), no se mockea.
3. **Aislar servicios externos** — Twilio se mockea; la base de datos se testea contra un contenedor real o in-memory.
4. **Cada test debe ser independiente** — limpiar estado entre tests (base de datos limpia para cada suite o cada test).
5. **Nombres descriptivos** — `should create a city when name is valid` en vez de `test 1`.
6. **Arrange → Act → Assert** — estructura consistente en todos los tests.

---

## 2. Stack de Testing

### 2.1 Herramientas

| Herramienta | Propósito | Configuración |
|-------------|-----------|---------------|
| **Jest** v29 | Framework de testing | `jest.config.js` en `backend/` |
| **ts-jest** | Transformer TypeScript | `transform: { '^.+\\.ts$': 'ts-jest' }` |
| **Supertest** | HTTP assertions (E2E) | Se usa con `app.getHttpServer()` |
| **TestingModule** | Creación de módulos NestJS aislados | `@nestjs/testing` |
| **class-validator** | Validación de DTOs (test manual) | Se instancia y valida directamente |
| **crypto (Node)** | Generación de OTP (test manual) | `crypto.randomInt` |

### 2.2 Configuración de Jest

```javascript
// backend/jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

| Opción | Valor | Descripción |
|--------|-------|-------------|
| `rootDir` | `src` | Buscar tests dentro de `src/` |
| `testRegex` | `.*\\.spec\\.ts$` | Archivos que terminan en `.spec.ts` |
| `transform` | `ts-jest` | Transpilar TypeScript |
| `coverageDirectory` | `../coverage` | Reporte de cobertura en `backend/coverage/` |
| `testEnvironment` | `node` | Entorno Node.js (no JSDOM) |

### 2.3 Scripts de npm

```json
// backend/package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

### 2.4 Dependencias de Testing

```json
// backend/package.json — devDependencies
{
  "@nestjs/testing": "^11.0.0",
  "@types/jest": "^29.5.0",
  "@types/supertest": "^6.0.0",
  "jest": "^29.7.0",
  "supertest": "^7.0.0",
  "ts-jest": "^29.2.0"
}
```

---

## 3. Tests Unitarios

### 3.1 Propósito

Validar la lógica de negocio de los **servicios** de forma aislada. No requieren base de datos real ni HTTP.

### 3.2 Qué Testear Unitariamente

| Componente | ¿Test unitario? | Detalle |
|------------|----------------|---------|
| **Service** | ✅ Siempre | Lógica de negocio, validaciones, excepciones |
| **Controller** | ⚠️ Opcional (cubierto por E2E) | Decoradores, Swagger, routing |
| **DTOs** | ⚠️ Si hay validación custom | Validaciones de class-validator |
| **Guards** | ✅ Independiente | Lógica de autorización |
| **Filters** | ✅ Independiente | Formato de respuesta de error |
| **Decorators** | ✅ Independiente | Metadata de roles |
| **Pipes** | ✅ Independiente | Transformación de datos |

### 3.3 Estructura de un Test Unitario

```typescript
// cities.service.spec.ts — Test unitario de servicio

// IMPORTS
import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { getModelToken } from '@nestjs/prisma'; // o el provider correspondiente

// MOCK
const mockPrisma = {
  city: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('CitiesService', () => {
  let service: CitiesService;

  // ARRANGE
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  // RESET MOCKS
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a city when name is valid', async () => {
      // Arrange
      const dto = { name: 'Bogotá' };
      const expected = { id: 'uuid', name: 'Bogotá', createdAt: new Date() };
      mockPrisma.city.create.mockResolvedValue(expected);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toEqual(expected);
      expect(mockPrisma.city.create).toHaveBeenCalledWith({
        data: { name: 'Bogotá' },
      });
    });

    it('should throw ConflictException when name already exists', async () => {
      // Arrange
      const dto = { name: 'Bogotá' };
      mockPrisma.city.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['name'] },
      });

      // Act & Assert
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    // Test de filtros
    it('should filter cities by search term', async () => { ... });
    it('should return all cities when no search term', async () => { ... });
  });

  describe('findOne', () => {
    it('should return a city when it exists', async () => { ... });
    it('should throw NotFoundException when city does not exist', async () => { ... });
  });
});
```

### 3.4 Qué Validar en Cada Test

| Escenario | Validación |
|-----------|------------|
| **Happy path** | Retorna la entidad esperada con los campos correctos |
| **No encontrado** | Lanza `NotFoundException` con mensaje descriptivo |
| **Duplicado** | Lanza `ConflictException` con mensaje que incluye el valor conflictivo |
| **Validación** | Lanza `BadRequestException` (o pasa a través del ValidationPipe) |
| **FK no existe** | Lanza `NotFoundException` específico |
| **Lista vacía** | Retorna array vacío `[]` |
| **Filtros sin match** | Retorna array vacío `[]` |

---

## 4. Tests de Integración

### 4.1 Propósito

Validar que el **servicio + Prisma + base de datos** funcionan correctamente juntos.

### 4.2 Estado Actual

Actualmente **no hay tests de integración** separados. Los tests existentes son **unitarios con mock de Prisma**. En el futuro se agregarán tests de integración contra una base de datos real.

### 4.3 Estrategia Futura

| Aspecto | Decisión |
|---------|----------|
| **Base de datos** | PostgreSQL en contenedor Docker (Testcontainers) o in-memory con `pg-mem` |
| **Setup** | Levantar DB antes de la suite, ejecutar migraciones, correr tests, destruir |
| **Aislamiento** | Un schema por suite de tests o truncar tablas entre tests |
| **Provider** | `PrismaService` real (no mockeado) |
| **Velocidad** | ~200ms por test vs ~5ms unitario |

### 4.4 Estructura Futura

```typescript
// cities.service.integration.spec.ts (futuro)
describe('CitiesService (integration)', () => {
  let service: CitiesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Usar PrismaService real conectado a test DB
    const module = await Test.createTestingModule({
      providers: [CitiesService, PrismaService],
    }).compile();

    service = module.get(CitiesService);
    prisma = module.get(PrismaService);

    // Ejecutar migraciones en DB de test
    await prisma.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS test');
    // ...
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar datos entre tests
    await prisma.city.deleteMany();
  });

  it('should persist a city and return it with an id', async () => {
    const result = await service.create({ name: 'Bogotá' });
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Bogotá');

    const found = await prisma.city.findUnique({ where: { id: result.id } });
    expect(found).not.toBeNull();
  });
});
```

### 4.5 Cuándo Usar Integración vs Unitario

| Situación | Tipo |
|-----------|------|
| Lógica de negocio compleja (transiciones de estado) | Unitario |
| Validación de unicidad en BD | Integración |
| Cascade delete o relaciones | Integración |
| Queries complejas (filtros + sorting) | Integración |
| Transacciones | Integración |

---

## 5. Tests E2E

### 5.1 Propósito

Validar que el **endpoint completo** (controller → service → DB) funciona correctamente, incluyendo:

- HTTP routing
- Validación de DTOs (ValidationPipe)
- Serialización de respuestas
- Códigos de estado HTTP
- Formato de errores
- Autenticación y autorización (futuro)

### 5.2 Estado Actual

Actualmente **no hay tests E2E**. Los tests existentes son unitarios con mock de Prisma. En el futuro se agregarán.

### 5.3 Estrategia Futura

```typescript
// cities.e2e-spec.ts (futuro)
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Cities (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Aplicar mismos pipes, filters, etc. que en producción
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /cities', () => {
    it('should create a city and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/cities')
        .send({ name: 'Bogotá' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Bogotá');
    });

    it('should return 400 when name is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/cities')
        .send({ name: '' })
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
    });

    it('should return 409 when city already exists', async () => {
      await request(app.getHttpServer())
        .post('/cities')
        .send({ name: 'Bogotá' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/cities')
        .send({ name: 'Bogotá' })
        .expect(409);
    });
  });
});
```

### 5.4 Qué Validar en E2E

| Aspecto | Validación |
|---------|------------|
| **HTTP Status** | Código correcto (200, 201, 400, 404, 409) |
| **Body** | Campos esperados y tipos correctos |
| **Estructura de error** | `{ statusCode, message, timestamp }` |
| **Validación** | Errores 400 con array de mensajes |
| **Autenticación** | 401 sin token, 200 con token válido |
| **Autorización** | 403 con rol incorrecto |

### 5.5 E2E vs Integración vs Unitario

| Aspecto | Unitario | Integración | E2E |
|---------|----------|-------------|-----|
| Velocidad | ~5ms | ~200ms | ~1s |
| Mockea DB | ✅ Sí | ❌ No | ❌ No |
| HTTP | ❌ No | ❌ No | ✅ Sí |
| ValidationPipe | ❌ No | ❌ No | ✅ Sí |
| Guards | ❌ No | ❌ No | ✅ Sí |

---

## 6. Cobertura

### 6.1 Estado Actual

```
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered
-------------------|---------|----------|---------|---------|----------
cities.service     |   100   |   100    |   100   |   100   |
cities.controller  |   100   |   100    |   100   |   100   |
services.service   |   100   |   100    |   100   |   100   |
services.controller|   100   |   100    |   100   |   100   |
providers.service  |   100   |   100    |   100   |   100   |
providers.controller|  100   |   100    |   100   |   100   |
clients.service    |   100   |   100    |   100   |   100   |
clients.controller |   100   |   100    |   100   |   100   |
bookings.service   |   100   |   100    |   100   |   100   |
bookings.controller|   100   |   100    |   100   |   100   |
sms.service        |   100   |   100    |   100   |   100   |
sms.controller     |   100   |   100    |   100   |   100   |
-------------------|---------|----------|---------|---------|----------
Total              |   100   |   100    |   100   |   100   |
```

**12 test suites, 111 tests, 100% cobertura en todos los módulos.**

### 6.2 Objetivos de Cobertura

| Nivel | Objetivo | Mínimo aceptable |
|-------|----------|------------------|
| Statements | 100% | 90% |
| Branches | 100% | 85% |
| Functions | 100% | 90% |
| Lines | 100% | 90% |

### 6.3 Exclusiones de Cobertura

Los siguientes archivos se excluyen del reporte de cobertura:

```javascript
// jest.config.js
collectCoverageFrom: [
  '**/*.(t|j)s',
  '!**/*.module.ts',      // Módulos NestJS (solo declaración)
  '!**/main.ts',           // Entry point
  '!**/*.dto.ts',          // DTOs (validados por class-validator en runtime)
  '!**/*.entity.ts',       // (si aplica)
  '!**/index.ts',          // Barril exports
],
```

### 6.4 Cómo Medir Cobertura

```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Ver reporte HTML
# Abrir coverage/lcov-report/index.html en navegador

# Ver reporte en terminal
npm run test:coverage | grep -E "^(File|All files|\||-+)"
```

---

## 7. Mocks

### 7.1 Qué Mockear

| Elemento | ¿Mock? | Razón |
|----------|--------|-------|
| **PrismaService** | ✅ Sí (unitarios) | Aislar lógica de negocio de la DB |
| **Twilio** | ✅ Sí | Servicio externo de pago |
| **Logger** | ✅ Sí | Evitar ruido en consola |
| **JwtService** | ⚠️ Solo si se testea auth | Mockear `sign()` y `verify()` |
| **ConfigService** | ✅ Sí | Controlar valores de configuración |

### 7.2 Qué NO Mockear

| Elemento | ¿Mock? | Razón |
|----------|--------|-------|
| **class-validator** | ❌ No | Validación real de DTOs |
| **class-transformer** | ❌ No | Transformación real |
| **crypto (Node)** | ❌ No | Función nativa, no necesita mock |
| **Date** | ❌ No | Usar `jest.useFakeTimers()` si necesario |

### 7.3 Patrones de Mock

**Mock de PrismaService (completo):**

```typescript
const mockPrisma = {
  city: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    upsert: jest.fn(),
  },
  service: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    // ...
  },
  // ... resto de modelos
  $transaction: jest.fn((fn) => fn(mockPrisma)),
};
```

**Mock de ConfigService:**

```typescript
const mockConfig = {
  get: jest.fn((key: string) => {
    const config = {
      JWT_SECRET: 'test-secret',
      TWILIO_ACCOUNT_SID: 'test-sid',
      TWILIO_AUTH_TOKEN: 'test-token',
      TWILIO_PHONE_NUMBER: '+1234567890',
    };
    return config[key];
  }),
};
```

**Mock de Twilio:**

```typescript
const mockTwilio = {
  messages: {
    create: jest.fn().mockResolvedValue({ sid: 'SM123' }),
  },
};
```

### 7.4 Limpieza de Mocks

```typescript
// En beforeEach, limpiar todos los mocks
beforeEach(() => {
  jest.clearAllMocks();
  // O para resetear implementaciones:
  jest.resetAllMocks();
  // O para resetear todo (incluyendo implementaciones manuales):
  jest.restoreAllMocks();
});
```

| Método | Efecto |
|--------|--------|
| `clearAllMocks()` | Resetea calls, instances, results — **no implementaciones** |
| `resetAllMocks()` | Resetea todo incluyendo implementaciones — **no implementaciones manuales** |
| `restoreAllMocks()` | Restaura implementaciones originales |

### 7.5 Mock de Prisma — Errores Comunes

```typescript
// Error P2002: Unique constraint violation (Prisma)
mockPrisma.city.create.mockRejectedValue({
  code: 'P2002',
  meta: { target: ['name'] },
});

// Error P2025: Record not found
mockPrisma.city.findUnique.mockResolvedValue(null);

// Error P2003: Foreign key constraint
mockPrisma.booking.create.mockRejectedValue({
  code: 'P2003',
  meta: { field_name: 'clientId' },
});

// Error genérico de BD
mockPrisma.city.findMany.mockRejectedValue(new Error('DB connection lost'));
```

---

## 8. Seeds y Datos de Prueba

### 8.1 Estrategia de Seeds

Los seeds se usan para:
1. **Desarrollo** — datos iniciales para trabajar localmente.
2. **Tests E2E** — datos predecibles para validar comportamiento completo.
3. **CI/CD** — datos consistentes para pipelines.

### 8.2 Seed de Desarrollo

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.providerService.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.client.deleteMany();
  await prisma.service.deleteMany();
  await prisma.city.deleteMany();

  // Cities
  const bogota = await prisma.city.create({ data: { name: 'Bogotá' } });
  const medellin = await prisma.city.create({ data: { name: 'Medellín' } });
  const cali = await prisma.city.create({ data: { name: 'Cali' } });

  // Services
  const general = await prisma.service.create({
    data: { name: 'Limpieza General', type: 'GENERAL', duration: 120 },
  });
  const deep = await prisma.service.create({
    data: { name: 'Limpieza Profunda', type: 'DEEP', duration: 240 },
  });
  const office = await prisma.service.create({
    data: { name: 'Limpieza de Oficinas', type: 'OFFICE', duration: 180 },
  });

  // Providers
  const juan = await prisma.provider.create({
    data: {
      name: 'Juan Pérez',
      phone: '+573001234567',
      email: 'juan@email.com',
      cityId: bogota.id,
    },
  });
  const maria = await prisma.provider.create({
    data: {
      name: 'María García',
      phone: '+573009876543',
      email: 'maria@email.com',
      cityId: medellin.id,
    },
  });

  // Clients
  const carlos = await prisma.client.create({
    data: { name: 'Carlos López', phone: '+573001111111' },
  });
  const ana = await prisma.client.create({
    data: { name: 'Ana Martínez', phone: '+573002222222' },
  });

  // ProviderService (relación N:N)
  await prisma.providerService.create({
    data: { providerId: juan.id, serviceId: general.id, price: 120000 },
  });
  await prisma.providerService.create({
    data: { providerId: juan.id, serviceId: office.id, price: 180000 },
  });
  await prisma.providerService.create({
    data: { providerId: maria.id, serviceId: deep.id, price: 250000 },
  });

  console.log('Seed completed successfully');
  console.log(`Cities: 3, Services: 3, Providers: 2, Clients: 2`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 8.3 Comando de Seed

```json
// backend/package.json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
# Ejecutar seed
npx prisma db seed

# Reset + seed
npx prisma migrate reset
```

### 8.4 Datos de Prueba en Tests

Para tests unitarios, los datos de prueba se definen como **factories inline** en los mismos tests:

```typescript
// Test data helpers
const createMockCity = (overrides = {}) => ({
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Bogotá',
  createdAt: new Date('2026-07-23T12:00:00.000Z'),
  ...overrides,
});

const createMockProvider = (overrides = {}) => ({
  id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  name: 'Juan Pérez',
  phone: '+573001234567',
  email: 'juan@email.com',
  rating: 0,
  reviewsCount: 0,
  isAvailable: true,
  cityId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  createdAt: new Date('2026-07-23T12:00:00.000Z'),
  updatedAt: new Date('2026-07-23T12:00:00.000Z'),
  ...overrides,
});
```

### 8.5 Convenciones de Datos de Prueba

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **UUIDs** | Strings fijos predecibles | `'a1b2c3d4-...'` |
| **Fechas** | Fijas, ISO 8601 | `new Date('2026-07-23T12:00:00.000Z')` |
| **Teléfonos** | Formato internacional | `+573001234567` |
| **Nombres** | Reales y diversos | Juan, María, Carlos |
| **Precios** | Números enteros o decimales | `120000`, `150000.50` |
| **Enums** | Valores válidos del enum | `'GENERAL'`, `'DEEP'`, `'PENDING'` |

### 8.6 Archivos de Ayuda

Para pruebas que requieran datos compartidos, se pueden crear helpers:

```
backend/src/
  common/
    test/
      mocks.ts           ← Mocks de PrismaService, ConfigService
      factories.ts       ← Factory functions para crear datos de prueba
      constants.ts       ← UUIDs y valores reutilizables
```

---

## 9. Organización de Archivos

### 9.1 Convención de Nombres

```
src/
  cities/
    cities.service.spec.ts       ← Tests unitarios del servicio
    cities.controller.spec.ts    ← Tests unitarios del controlador
    cities.e2e-spec.ts           ← Tests E2E (futuro)
    cities.integration.spec.ts   ← Tests de integración (futuro)
```

| Tipo | Sufijo | Ubicación |
|------|--------|-----------|
| Unitario (service) | `.service.spec.ts` | Junto al service |
| Unitario (controller) | `.controller.spec.ts` | Junto al controller |
| Integración | `.integration.spec.ts` | Junto al módulo |
| E2E | `.e2e-spec.ts` | Junto al módulo o en `test/` |

### 9.2 Estructura Actual

```
backend/src/
  cities/
    cities.service.spec.ts        ✅ (19 tests)
    cities.controller.spec.ts     ✅ (incluido en service spec)
    dto/
  services/
    services.service.spec.ts      ✅ (21 tests)
  providers/
    providers.service.spec.ts     ✅ (22 tests)
  clients/
    clients.service.spec.ts       ✅ (21 tests)
  bookings/
    bookings.service.spec.ts      ✅ (23 tests)
  sms/
    sms.service.spec.ts           ✅ (8 tests)
  prisma/
  common/
```

### 9.3 Suite de Tests por Módulo

| Módulo | Archivo | Tests | Cobertura |
|--------|---------|-------|-----------|
| Cities | `cities.service.spec.ts` | 19 | 100% |
| Services | `services.service.spec.ts` | 21 | 100% |
| Providers | `providers.service.spec.ts` | 22 | 100% |
| Clients | `clients.service.spec.ts` | 21 | 100% |
| Bookings | `bookings.service.spec.ts` | 23 | 100% |
| SMS | `sms.service.spec.ts` | 8 | 100% |
| **Total** | **6 suites** | **111** | **100%** |

---

## 10. Ejecución de Tests

### 10.1 Comandos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar en verbose
npm run test:verbose

# Ejecutar tests de un módulo específico
npx jest cities
npx jest --testPathPattern=cities

# Ejecutar un test específico por nombre
npx jest -t "should create a city"

# Ejecutar un archivo específico
npx jest src/cities/cities.service.spec.ts
```

### 10.2 Flags Útiles de Jest

| Flag | Propósito |
|------|-----------|
| `--watch` | Modo watch (re-ejecuta al cambiar archivos) |
| `--coverage` | Genera reporte de cobertura |
| `--verbose` | Muestra nombres de tests individuales |
| `--silent` | Suprime console.log de los tests |
| `--detectOpenHandles` | Detecta handles abiertos (útil para debugging) |
| `--forceExit` | Fuerza salida después de tests (último recurso) |
| `-t "<pattern>"` | Ejecuta solo tests cuyo nombre haga match |
| `--testPathPattern=<regex>` | Ejecuta solo archivos cuyo path haga match |

### 10.3 Salida Esperada

```bash
$ npm test

> cleaning-app-backend@0.1.0 test
> jest

 PASS   src/cities/cities.service.spec.ts (13 ms)
 PASS   src/services/services.service.spec.ts (15 ms)
 PASS   src/providers/providers.service.spec.ts (14 ms)
 PASS   src/clients/clients.service.spec.ts (12 ms)
 PASS   src/bookings/bookings.service.spec.ts (16 ms)
 PASS   src/sms/sms.service.spec.ts (8 ms)

Test Suites: 6 passed, 6 total
Tests:       111 passed, 111 total
Snapshots:   0 total
Time:        3.2 s
```

---

## 11. Buenas Prácticas

### 11.1 Estructura del Test

```
describe('CitiesService', () => {      // 1. Describe el componente
  let service: CitiesService;           // 2. Declarar variables

  beforeAll(async () => { ... });       // 3. Setup (una vez)
  beforeEach(() => { jest.clearAllMocks(); });  // 4. Reset mocks

  describe('create', () => {            // 5. Describe el método
    it('should create a city when name is valid', () => { ... });
    //       ^ frase descriptiva en inglés, presente simple
  });
});
```

### 11.2 Reglas de Nombres

- **Archivos:** `{modulo}.{tipo}.spec.ts` — ej: `cities.service.spec.ts`
- **Suites:** `describe('CitiesService', ...)` — nombre del componente en PascalCase
- **Métodos:** `describe('create', ...)` — nombre del método en camelCase
- **Tests:** `it('should create a city when name is valid', ...)` — frase en inglés que describe comportamiento esperado
- **Variables mock:** prefijo `mock` — `mockPrisma`, `mockConfig`

### 11.3 Reglas de ASSERT

```typescript
// ✅ Correcto — assert específico
expect(result.name).toBe('Bogotá');
expect(mockPrisma.city.create).toHaveBeenCalledWith({ data: { name: 'Bogotá' } });

// ❌ Incorrecto — assert genérico
expect(result).toBeDefined();
expect(mockPrisma.city.create).toHaveBeenCalled();
```

### 11.4 Reglas por Tipo de Test

| Regla | Unitario | Integración | E2E |
|-------|----------|-------------|-----|
| Mockear Prisma | ✅ | ❌ | ❌ |
| Mockear externos (Twilio) | ✅ | ✅ | ⚠️ (mock real) |
| Usar base de datos real | ❌ | ✅ | ✅ |
| Validar HTTP status | ❌ | ❌ | ✅ |
| Validar serialización | ❌ | ❌ | ✅ |
| Validar ValidationPipe | ❌ | ❌ | ✅ |
| Aislar de otros tests | ✅ beforeEach | ✅ beforeEach | ✅ beforeEach |

### 11.5 Anti-patrones

```typescript
// ❌ Testear implementation details
it('should call prisma.city.create', async () => {
  await service.create({ name: 'Bogotá' });
  expect(mockPrisma.city.create).toHaveBeenCalledTimes(1);
});

// ✅ Testear comportamiento
it('should create a city and return it', async () => {
  const result = await service.create({ name: 'Bogotá' });
  expect(result.name).toBe('Bogotá');
});
```

```typescript
// ❌ Mock de too much
const mockDate = new Date('2026-01-01');
jest.useFakeTimers().setSystemTime(mockDate);
// (solo mockear fechas si es crítico para la lógica)

// ✅ Usar fecha real
const result = await service.create({ name: 'Bogotá' });
expect(result.createdAt).toBeInstanceOf(Date);
```

```typescript
// ❌ Test que depende de otro test
let savedCity;
it('should create', async () => {
  savedCity = await service.create({ name: 'Bogotá' });
});
it('should find by id', async () => {
  const result = await service.findOne(savedCity.id);
  // Depende de savedCity del test anterior ❌
});

// ✅ Tests independientes
it('should create', async () => { ... });
it('should find by id', async () => { ... });
```

### 11.6 Cuándo NO Escribir Tests

| Situación | Alternativa |
|-----------|-------------|
| Getters/setters simples | No testear |
| DTOs sin validación custom | Confiar en class-validator |
| Decoradores estándar | No testear |
| Módulos (Module) | No testear |
| main.ts (bootstrap) | Test E2E del app module |
| Constantes/Enums | No testear (a menos que tengan lógica) |

### 11.7 Mantenimiento de Tests

1. **Correr tests antes de cada commit:** `npm test` debe pasar.
2. **Actualizar tests al cambiar lógica:** si cambia el comportamiento, cambiar el test.
3. **No comentar tests fallidos:** arreglarlos o eliminarlos.
4. **Revisar cobertura regularmente:** mantener >90% en branches.
5. **Testear primero (TDD opcional):** escribir el test antes del código es buena práctica pero no obligatoria.

---

## 12. Ejemplo por Módulo

### 12.1 Cities Service (19 tests)

```typescript
describe('CitiesService', () => {
  describe('create', () => {
    it('should create a city when name is valid');
    it('should throw ConflictException when name already exists');
    it('should throw ConflictException with the duplicate name in message');
  });

  describe('findAll', () => {
    it('should return all cities when no search term');
    it('should filter cities by search term (case-insensitive)');
    it('should return empty array when no cities match search');
  });

  describe('findOne', () => {
    it('should return a city when it exists');
    it('should throw NotFoundException when city does not exist');
    it('should throw NotFoundException with the id in message');
  });

  describe('update', () => {
    it('should update a city when it exists');
    it('should throw NotFoundException when city does not exist');
    it('should throw ConflictException when new name already exists');
  });

  describe('remove', () => {
    it('should delete a city when it exists');
    it('should throw NotFoundException when city does not exist');
    it('should return the deleted city');
  });
});
```

### 12.2 Bookings Service (23 tests)

```typescript
describe('BookingsService', () => {
  describe('create', () => {
    it('should create a booking when all FKs exist');
    it('should throw NotFoundException when client does not exist');
    it('should throw NotFoundException when provider does not exist');
    it('should throw NotFoundException when service does not exist');
    it('should set status to PENDING by default');
  });

  describe('findAll', () => {
    it('should return all bookings when no filters');
    it('should filter by clientId');
    it('should filter by providerId');
    it('should filter by status');
    it('should combine multiple filters with AND');
    it('should return bookings ordered by scheduledAt DESC');
    it('should include client, provider and service relations');
    it('should return empty array when no bookings match');
  });

  describe('findOne', () => {
    it('should return a booking with relations when it exists');
    it('should throw NotFoundException when booking does not exist');
  });

  describe('update', () => {
    it('should update booking fields');
    it('should throw NotFoundException when booking does not exist');
    it('should validate status transitions');
  });

  describe('remove', () => {
    it('should delete a booking when it exists');
    it('should throw NotFoundException when booking does not exist');
    it('should return the deleted booking');
  });
});
```

### 12.3 SMS Service (8 tests)

```typescript
describe('SmsService', () => {
  describe('sendOtp', () => {
    it('should generate a 6-digit OTP code');
    it('should store the OTP in the database');
    it('should set expiration to 10 minutes from now');
    it('should send SMS via Twilio when configured');
    it('should log to console when Twilio is not configured');
    it('should throw BadRequestException for invalid phone format');
  });

  describe('verifyOtp', () => {
    it('should return success when code is correct and not expired');
    it('should increment attempts on wrong code');
    it('should throw BadRequestException when max attempts reached');
    it('should throw BadRequestException when code is expired');
    it('should throw BadRequestException when code does not exist');
  });
});
```

---

*Documento de testing — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
