# Architecture — Cleaning App

> Documento completo de arquitectura del sistema. Cubre backend, frontend mobile, frontend admin, patrones, flujo de datos y buenas prácticas.

---

## 1. Vista General del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                            INTERNET                                     │
└────────────────────────────────────────────────────────────────────────┘
        │                        │                          │
        ▼                        ▼                          ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐
│  ADMIN WEB APP   │   │  MOBILE APP       │   │   SWAGGER UI         │
│  Vite 6 + React  │   │  Expo SDK 52      │   │   /api/docs          │
│  Puerto 5173     │   │  Puerto 19006     │   │                      │
└────────┬─────────┘   └────────┬─────────┘   └──────────────────────┘
         │                      │
         └──────────┬───────────┘
                    │ HTTPS / JSON
                    ▼
        ┌──────────────────────────────┐
        │       NESTJS BACKEND          │
        │       Puerto 3000             │
        │                               │
        │  ┌─────────────────────────┐  │
        │  │   Global ValidationPipe  │  │
        │  │   (whitelist, forbid,    │  │
        │  │    transform)            │  │
        │  └──────────┬──────────────┘  │
        │             ▼                  │
        │  ┌─────────────────────────┐  │
        │  │   Controller Layer       │  │
        │  │   (HTTP handlers)        │  │
        │  └──────────┬──────────────┘  │
        │             ▼                  │
        │  ┌─────────────────────────┐  │
        │  │   Service Layer          │  │
        │  │   (Business logic)       │  │
        │  └──────────┬──────────────┘  │
        │             ▼                  │
        │  ┌─────────────────────────┐  │
        │  │   PrismaService          │  │
        │  │   (Repository Layer)     │  │
        │  └──────────┬──────────────┘  │
        └─────────────┼────────────────┘
                      │ Prisma ORM
                      ▼
        ┌──────────────────────────────┐
        │    POSTGRESQL (NEON)          │
        │    Serverless                 │
        │    sslmode=require            │
        └──────────────────────────────┘

        ┌──────────────────────────────┐
        │    TWILIO (SMS)              │
        │    OTP / Notificaciones      │
        └──────────────────────────────┘
```

---

## 2. Backend Architecture

### 2.1 Stack Tecnológico

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| Lenguaje | TypeScript | ^5.7 | Tipado estático, decorators |
| Framework | NestJS | ^11.0.0 | Estructura MVC, DI, módulos |
| Servidor HTTP | Express (via @nestjs/platform-express) | ^11.0.0 | Peticiones HTTP |
| ORM | Prisma | ^6.19.3 | Tipado seguro, migraciones |
| Base de datos | PostgreSQL (Neon) | — | Persistencia |
| SMS | Twilio | ^5.4.0 | Mensajería |
| Validación | class-validator + class-transformer | ^0.14.1 / ^0.5.1 | DTOs |
| Documentación | @nestjs/swagger + swagger-ui-express | ^11.4.6 / ^5.0.1 | OpenAPI |
| Autenticación | @nestjs/jwt + @nestjs/passport + passport-jwt | ^11.0.0 | JWT |
| Tests | Jest + ts-jest | ^30.4.2 / ^29.4.12 | Unit tests |

### 2.2 Estructura de Directorios

```
backend/
├── prisma/
│   └── schema.prisma              # Modelo de datos (único source of truth)
├── src/
│   ├── main.ts                    # Bootstrap: servidor, pipes, filtros, CORS, Swagger
│   ├── app.module.ts              # Módulo raíz: importa todos los feature modules
│   │
│   ├── prisma/                    # Capa de infraestructura (global)
│   │   ├── prisma.module.ts       # @Global() — disponible sin importar
│   │   └── prisma.service.ts      # extends PrismaClient, connect/disconnect lifecycle
│   │
│   ├── common/                    # Componentes compartidos (global)
│   │   └── filters/
│   │       └── all-exceptions.filter.ts  # @Catch() global
│   │
│   ├── cities/                    # Feature module (patrón de referencia)
│   │   ├── dto/
│   │   │   ├── create-city.dto.ts
│   │   │   ├── update-city.dto.ts
│   │   │   └── query-city.dto.ts
│   │   ├── cities.service.ts
│   │   ├── cities.controller.ts
│   │   ├── cities.module.ts
│   │   ├── cities.service.spec.ts
│   │   └── cities.controller.spec.ts
│   │
│   ├── clients/                   # Feature module
│   ├── providers/                 # Feature module
│   ├── services/                  # Feature module
│   ├── bookings/                  # Feature module
│   └── sms/                       # Utility module (OTP)
│
├── jest.config.js
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── package.json
└── .env                           # Variables de entorno (gitignored)
```

### 2.3 Feature First Architecture

Cada funcionalidad del negocio es un **módulo autocontenido** dentro de `src/`. La arquitectura **Feature First** organiza el código por funcionalidad, no por tipo técnico.

**Principio:** Todo lo que pertenece a una funcionalidad vive dentro de su carpeta (DTOs, servicio, controlador, pruebas).

```
✅ Feature First (cómo está organizado):
src/
├── cities/       # Todo sobre ciudades
├── clients/      # Todo sobre clientes
├── providers/    # Todo sobre prestadores

❌ Technical First (cómo NO está organizado):
src/
├── controllers/  # Mezcla todos los controladores
├── services/     # Mezcla todos los servicios
├── dto/          # Mezcla todos los DTOs
```

**Ventajas:**
- **Cohesión**: Cada módulo es funcionalmente completo.
- **Aislamiento**: Los cambios en un módulo no afectan a otros.
- **Escalabilidad**: Nuevos desarrolladores entienden rápido.
- **Eliminación segura**: Se puede eliminar un módulo completo sin afectar otros.

### 2.4 Capas Internas de Cada Feature Module

```
DTO Layer
┌──────────────────────────────────────────────┐
│ dto/create-entity.dto.ts                     │
│ dto/update-entity.dto.ts                     │
│ dto/query-entity.dto.ts                      │
├──────────────────────────────────────────────┤
│ Define la forma de los datos de entrada.      │
│ Cada propiedad tiene:                         │
│  • class-validator (@IsString, @IsNotEmpty)   │
│  • Swagger (@ApiProperty, @ApiPropertyOpt)    │
└──────────────────────────────────────────────┘

Controller Layer
┌──────────────────────────────────────────────┐
│ entity.controller.ts                          │
├──────────────────────────────────────────────┤
│ • @Controller('entities')                     │
│ • 5 endpoints CRUD estándar                   │
│ • Swagger (@ApiTags, @ApiOperation)           │
│ • SIN lógica de negocio                       │
│ • SOLO delega al servicio                     │
└──────────────────────────────────────────────┘

Service Layer
┌──────────────────────────────────────────────┐
│ entity.service.ts                             │
├──────────────────────────────────────────────┤
│ • @Injectable()                               │
│ • Toda la lógica de negocio                   │
│ • Validaciones (existencia, unicidad)         │
│ • Orquesta PrismaService                      │
│ • Lanza excepciones HTTP                      │
└──────────────────────────────────────────────┘

Module Layer
┌──────────────────────────────────────────────┐
│ entity.module.ts                              │
├──────────────────────────────────────────────┤
│ • @Module({ controllers, providers })         │
│ • NO necesita imports (Prisma + Config son    │
│   globales)                                   │
└──────────────────────────────────────────────┘

Test Layer
┌──────────────────────────────────────────────┐
│ entity.service.spec.ts                        │
│ entity.controller.spec.ts                     │
├──────────────────────────────────────────────┤
│ • Mocks completos de PrismaService            │
│ • Happy path + error path para cada método    │
└──────────────────────────────────────────────┘
```

### 2.5 Inyección de Dependencias (NestJS DI)

NestJS usa un **contenedor IoC (Inversion of Control)** que gestiona automáticamente la creación y el ciclo de vida de las dependencias.

#### Registro de Dependencias

```typescript
// 1. Módulo declara qué proveedores tiene
@Module({
  controllers: [CitiesController],
  providers: [CitiesService],     // ← Se registra en el contenedor IoC
})
export class CitiesModule {}

// 2. NestJS crea automáticamente una instancia de CitiesService

// 3. CitiesController la recibe inyectada
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}
  // citiesService ya está inicializada y lista para usar
}
```

#### Ámbito (Scope) de las Dependencias

| Ámbito | Descripción | Uso |
|--------|-------------|-----|
| **Singleton** (default) | Una instancia para toda la aplicación | Services, PrismaService, ConfigService |
| **Request** | Una instancia por petición HTTP | Guards, Interceptors (futuro) |
| **Transient** | Una nueva instancia cada vez que se inyecta | Utilidades sin estado |

**Todos los servicios del proyecto son Singleton** — una sola instancia reutilizada.

#### Dependencias Globales

Algunos módulos están marcados como `@Global()` para evitar importarlos en cada módulo:

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],       // ← Disponible para cualquiera que lo inyecte
})
export class PrismaModule {}

// En cualquier otro módulo:
@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}  // ← Sin importar PrismaModule
}
```

**Módulos globales actuales:**

| Módulo | Provee | Marcado como Global |
|--------|--------|-------------------|
| `PrismaModule` | `PrismaService` | `@Global()` |
| `ConfigModule` | `ConfigService` | `isGlobal: true` en `forRoot()` |

### 2.6 DTOs (Data Transfer Objects)

Los DTOs definen **la forma y validación de los datos que entran al sistema**. Son la primera barrera de defensa.

#### Principios de DTOs

1. **Un DTO por operación**: `Create*Dto`, `Update*Dto`, `Query*Dto` son clases separadas.
2. **Validación en frontera**: Todo dato que entra se valida en el DTO — nunca confiar en el cliente.
3. **Auto-documentados**: Los decoradores de Swagger generan la documentación automáticamente.

#### Jerarquía de DTOs

```
CreateEntityDto
    │
    ▼
UpdateEntityDto extends PartialType(CreateEntityDto)
    │ (hereda todas las propiedades como opcionales)
    ▼
Se puede enviar un subconjunto de campos para actualizar
```

#### Anatomía de un DTO

```typescript
export class CreateProviderDto {
  // 1. Decorador Swagger (documentación + ejemplo)
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del proveedor',
    minLength: 2,
    maxLength: 100,
  })
  // 2. Decoradores de validación (class-validator)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  // 3. Propiedad con tipo
  name: string;

  // Opcionales:
  @ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsString()
  email?: string;
}
```

#### Validación Automática

El `ValidationPipe` global (configurado en `main.ts`) intercepta TODAS las peticiones y:

1. **`whitelist: true`** — Elimina propiedades del body que no están decoradas en el DTO.
2. **`forbidNonWhitelisted: true`** — Rechaza (400) si el body contiene propiedades no decoradas.
3. **`transform: true`** — Convierte tipos automáticamente (ej: `"123"` → `123`).

```
Body entrante → ValidationPipe → DTO validado o Error 400
     │                                  │
     ▼                                  ▼
  { name: "Juan",                    { statusCode: 400,
    extra: "x" }    →   REJECT         message: ["property extra should not exist"] }
```

### 2.7 Repository Pattern (Prisma como Repositorio)

En lugar de crear repositorios separados, **PrismaService actúa directamente como la capa de repositorio**. Prisma ya proporciona una abstracción completa y tipada sobre la base de datos.

#### Mapeo Operación → Método Prisma

| Operación de Negocio | Método Prisma | Ejemplo |
|---------------------|---------------|---------|
| Buscar por ID | `findUnique({ where: { id } })` | `this.prisma.city.findUnique({ where: { id } })` |
| Buscar por campo único | `findUnique({ where: { field } })` | `this.prisma.client.findUnique({ where: { phone } })` |
| Listar con filtros | `findMany({ where, orderBy, include })` | `this.prisma.provider.findMany({ where: { isAvailable: true } })` |
| Crear | `create({ data })` | `this.prisma.service.create({ data: dto })` |
| Actualizar | `update({ where: { id }, data })` | `this.prisma.provider.update({ where: { id }, data: dto })` |
| Eliminar | `delete({ where: { id } })` | `this.prisma.booking.delete({ where: { id } })` |
| Contar | `count({ where })` | `this.prisma.booking.count({ where: { status: 'PENDING' } })` |

#### Reglas del Repository Pattern

1. **Los servicios nunca acceden directamente a la base de datos.** Solo a través de `PrismaService`.
2. **Los servicios nunca construyen SQL.** Todo se hace mediante métodos tipados de Prisma.
3. **Los servicios usan `include` para relaciones**, nunca `raw` queries.
4. **Los servicios retornan tipos de Prisma** (`City`, `Provider`, etc.), no planos genéricos.

```typescript
// ✅ Correcto: servicio usa PrismaService como repositorio
@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: QueryProviderDto) {
    return this.prisma.provider.findMany({
      where: { /* ... */ },
      include: { city: true },       // ← Relaciones incluidas
      orderBy: { name: 'asc' },       // ← Siempre ordenado
    });
  }
}

// ❌ Incorrecto: el servicio no interactúa directamente con la DB
// (no hay otro patrón válido — PrismaService es la única vía)
```

### 2.8 Controladores (Controllers)

Los controladores son la **capa de presentación HTTP**. Su única responsabilidad es manejar la interacción con HTTP y delegar al servicio.

#### Responsabilidades

```
✅ HACE:
  • Extraer parámetros (@Param, @Query, @Body)
  • Aplicar decoradores Swagger
  • Llamar al servicio
  • Retornar la respuesta

❌ NO HACE:
  • Validaciones de negocio (eso es del DTO + servicio)
  • Consultas a base de datos
  • Transformaciones complejas
  • Lógica condicional más allá de delegar
```

#### Endpoints Estándar (5 por módulo)

```typescript
@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()                                    // Crear
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.create(dto);
  }

  @Get()                                     // Listar
  findAll(@Query() query?: QueryCityDto) {
    return this.citiesService.findAll(query);
  }

  @Get(':id')                                // Obtener por ID
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')                              // Actualizar
  update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.citiesService.update(id, dto);
  }

  @Delete(':id')                             // Eliminar
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
```

### 2.9 Servicios (Services)

Los servicios contienen **toda la lógica de negocio** de la aplicación. Son la capa más importante.

#### Anatomía de un Servicio

```typescript
@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREATE — Validar unicidad, luego crear
  async create(dto: CreateProviderDto) {
    const existing = await this.prisma.provider.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
    }
    return this.prisma.provider.create({
      data: dto,
      include: { city: true },
    });
  }

  // 2. FIND ALL — Construir filtros dinámicamente
  async findAll(query?: QueryProviderDto) {
    const where: any = {};
    if (query?.search) where.name = { contains: query.search, mode: 'insensitive' };
    if (query?.isAvailable !== undefined) where.isAvailable = query.isAvailable;
    if (query?.cityId) where.cityId = query.cityId;
    return this.prisma.provider.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { city: true },
    });
  }

  // 3. FIND ONE — Validar existencia
  async findOne(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: { city: true },
    });
    if (!provider) {
      throw new NotFoundException(`Proveedor con id "${id}" no encontrado`);
    }
    return provider;
  }

  // 4. UPDATE — Validar existencia + unicidad (si cambia el campo único)
  async update(id: string, dto: UpdateProviderDto) {
    await this.findOne(id);  // Reutiliza validación de existencia
    if (dto.phone) {
      const existing = await this.prisma.provider.findUnique({
        where: { phone: dto.phone },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
      }
    }
    return this.prisma.provider.update({
      where: { id },
      data: dto,
      include: { city: true },
    });
  }

  // 5. DELETE — Validar existencia, luego eliminar
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.provider.delete({ where: { id } });
  }
}
```

#### Patrones de Servicio

| Patrón | Descripción | Ejemplo |
|--------|-------------|---------|
| **Existencia primero** | Validar que la entidad existe antes de operar | `await this.findOne(id)` al inicio de update/remove |
| **Unicidad primero** | Validar que el valor único no esté ocupado antes de crear/actualizar | `findUnique({ where: { phone } })` antes de `create` |
| **Include en respuestas** | Devolver relaciones relevantes en cada operación | `include: { city: true }` |
| **Error temprano** | Fallar rápido si algo está mal, no continuar con datos inválidos | `throw new NotFoundException()` antes de cualquier operación DB |
| **Filtros dinámicos** | Construir objeto `where` basado en query params opcionales | `where: {}` que se llena condicionalmente |

### 2.10 Módulos (Modules)

Cada módulo es una **unidad de organización** que agrupa controlador(es) y servicio(s) relacionados.

#### Módulo Feature

```typescript
@Module({
  controllers: [CitiesController],     // Solo los controladores de este módulo
  providers: [CitiesService],          // Solo los servicios de este módulo
  // NO lleva imports → PrismaModule y ConfigModule son globales
})
export class CitiesModule {}
```

#### Módulo Global

```typescript
@Global()                               // ← Disponible en TODA la app sin importar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],             // ← Lo que otros módulos pueden inyectar
})
export class PrismaModule {}
```

#### Módulo Raíz (app.module.ts)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Global
    PrismaModule,                               // Global por @Global()
    CitiesModule,                               // Feature
    ClientsModule,                              // Feature
    ProvidersModule,                            // Feature
    ServicesModule,                             // Feature
    BookingsModule,                             // Feature
    SmsModule,                                  // Feature
  ],
})
export class AppModule {}
```

---

## 3. Prisma & Base de Datos

### 3.1 Estrategia de Base de Datos

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| Motor | PostgreSQL | Relacional, maduro, amplio soporte |
| Hosting | Neon (serverless) | Escalabilidad automática, sin gestión de servidores, branch para staging |
| ORM | Prisma v6 | Tipado seguro, migraciones automáticas, DX superior |
| IDs | UUID v4 | Escalabilidad distribuida, sin autoincrement |
| Conexión | Pooled (DATABASE_URL) + Direct (DIRECT_URL) | Pooled para queries, direct para migraciones |

### 3.2 Modelo de Datos

```
┌──────────┐     ┌───────────┐     ┌───────────┐
│   City   │     │  Client   │     │  Provider  │
├──────────┤     ├───────────┤     ├───────────┤
│ id (PK)  │     │ id (PK)   │     │ id (PK)   │
│ name (U) │     │ name      │     │ name      │
│ createdAt│     │ phone (U) │     │ phone (U) │
└──────────┘     │ email?    │     │ email?    │
       │         │ createdAt │     │ description?
       │         │ updatedAt │     │ rating     │
       │         └───────────┘     │ reviews   │
       │                │          │ isAvailable│
       │                │          │ latitude? │
       │                ▼          │ longitude?│
       │         ┌───────────┐     │ cityId (FK)│──┘
       │         │  Booking  │     └───────────┘
       │         ├───────────┤            │
       └────────▶│ id (PK)   │            │
                 │ clientId  │◀───────────┘
                 │ providerId│
                 │ serviceId │────┐
                 │ status    │    │
                 │ scheduledAt│   │
                 │ address   │   │
                 │ notes?    │   │
                 │ totalPrice│   │
                 │ createdAt │   │
                 │ updatedAt │   │
                 └───────────┘   │
                        │        │
                        ▼        ▼
                 ┌───────────┐ ┌───────────┐
                 │  Review   │ │  Service   │
                 ├───────────┤ ├───────────┤
                 │ id (PK)   │ │ id (PK)   │
                 │ bookingId │ │ name (U)  │
                 │ rating    │ │ description?
                 │ comment?  │ │ type (enum)│
                 │ createdAt │ │ duration  │
                 └───────────┘ │ createdAt │
                              └───────────┘

┌───────────┐     ┌──────────────────┐
│    Otp    │     │ ProviderService   │
├───────────┤     ├──────────────────┤
│ id (PK)   │     │ providerId (PK)  │
│ phone     │     │ serviceId (PK)   │
│ code      │     │ price            │
│ expiresAt │     └──────────────────┘
│ verified  │
│ attempts  │
│ createdAt │
└───────────┘
```

### 3.3 Convenciones del Schema

```prisma
// Nombres: PascalCase singular
model City {
  // ID: UUID siempre
  id String @id @default(uuid())

  // Campos: camelCase
  // Únicos: @unique explícito
  name String @unique

  // Obligatorios: sin ?
  // Opcionales: con ?
  description String?

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones explícitas (siempre)
  providers Provider[]
}

// Enums: PascalCase, valores UPPER_SNAKE_CASE
enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// Relaciones con FK explícita
model Provider {
  // FK: camelCase + Id
  cityId String
  city   City @relation(fields: [cityId], references: [id])
}

// Índices en campos de filtrado frecuente
@@index([status])
@@index([cityId])

// Tablas pivote con PK compuesta
model ProviderService {
  providerId String
  serviceId  String
  @@id([providerId, serviceId])
}
```

### 3.4 Flujo de Trabajo con Prisma

```
[1] Editar schema.prisma
    │
    ▼
[2] npx prisma generate
    │ (actualiza @prisma/client con nuevos tipos)
    ▼
[3] npx prisma migrate dev --name descripcion
    │ (genera SQL, aplica a DB local)
    ▼
[4] Usar en código:
    this.prisma.modelo.metodo()
```

### 3.5 Enums de Prisma

Los enums de Prisma están disponibles como **enums de TypeScript** en el cliente generado:

```typescript
import { ServiceType, BookingStatus } from '@prisma/client';

// Uso en DTOs:
@IsEnum(ServiceType)
type: ServiceType;

// Uso en queries:
where: { status: BookingStatus.PENDING }

// Uso en Swagger:
@ApiProperty({ enum: BookingStatus })
```

---

## 4. Neon (PostgreSQL Serverless)

### 4.1 Configuración de Conexión

```env
# Pooled (para queries normales)
DATABASE_URL="postgresql://user:password@ep-name-pooler.region.aws.neon.tech/db?sslmode=require"

# Direct (para migraciones)
DIRECT_URL="postgresql://user:password@ep-name.region.aws.neon.tech/db?sslmode=require&channel_binding=require"
```

### 4.2 Características de Neon

| Característica | Beneficio |
|---------------|-----------|
| **Serverless** | Sin gestión de servidores, escala a 0 cuando no se usa |
| **Pooling** | Conexiones optimizadas para serverless (DATABASE_URL) |
| **Branching** | Ramas instantáneas para staging/testing |
| **SSLMODE=require** | Conexiones seguras por defecto |
| **Auto-pause** | La DB se pausa tras inactividad (Free tier) |
| **Cold start** | ~1-3 segundos al reactivar (importante en dev) |

### 4.3 Pooled vs Direct

| Tipo | URL | Uso |
|------|-----|-----|
| **Pooled** | `*-pooler.region.neon.tech` | Queries de la aplicación (conexiones compartidas) |
| **Direct** | `*.region.neon.tech` | Migraciones (require conexión directa) |

---

## 5. Twilio (SMS)

### 5.1 Arquitectura de SMS

```
Aplicación (OtpService)
    │
    │ twilio.messages.create({ to, from, body })
    ▼
Twilio API
    │
    ├── Configurado → Envía SMS real al teléfono del usuario
    │
    └── No configurado → Log en consola (modo desarrollo)
```

### 5.2 Configuración

```typescript
// OtpService.initTwilio()
const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

if (accountSid && authToken) {
  const twilio = require('twilio');
  this.twilioClient = twilio(accountSid, authToken);
}
// Si no hay credenciales, sendSms() hace console.log()
```

### 5.3 Flujo de Envío

```typescript
async sendSms(to: string, body: string) {
  if (this.twilioClient) {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    await this.twilioClient.messages.create({ to, from, body });
  } else {
    this.logger.log(`[SMS simulacro] Para: ${to} | Mensaje: ${body}`);
  }
}
```

### 5.4 OTP: Integración SMS + Base de Datos

```
sendOtp(phone):
  1. Generar código: randomInt(100000, 999999)
  2. Guardar en DB: Otp { phone, code, expiresAt: now+10min }
  3. Enviar SMS: "Tu código de verificación es: XXXXXX"

verifyOtp(phone, code):
  1. Buscar último OTP no verificado y no expirado
  2. Si no existe → BadRequestException
  3. Si attempts >= 5 → BadRequestException (rate limit)
  4. Si code incorrecto → incrementar attempts → BadRequestException
  5. Si code correcto → marcar verified = true → OK
```

---

## 6. Frontend Mobile (Expo + React Native + NativeWind)

### 6.1 Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Framework | Expo SDK 52 | Desarrollo y build de React Native |
| Lenguaje | TypeScript | Tipado estático |
| UI | NativeWind (Tailwind CSS) | Estilos utilitarios |
| Navegación | React Navigation | Rutas y stacks |
| Estado global | Zustand | Store ligero y tipado |
| Data fetching | React Query (TanStack Query) | Cache, sincronización, estado de carga |
| HTTP | fetch nativo o axios | Comunicación con API |

### 6.2 NativeWind (Estilos)

NativeWind permite usar clases **Tailwind CSS** directamente en React Native.

```tsx
// ✅ Siempre usar NativeWind para estilos
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-800">Hola Mundo</Text>
  <View className="mt-4 bg-blue-500 rounded-lg p-3">
    <Text className="text-white text-center">Botón</Text>
  </View>
</View>

// ❌ NO usar StyleSheet.create
// const styles = StyleSheet.create({ container: { flex: 1 } });
```

### 6.3 React Query (TanStack Query)

React Query maneja **fetcheo, cache y sincronización** de datos del servidor.

```tsx
// Hook personalizado para obtener datos
function useCities(search?: string) {
  return useQuery({
    queryKey: ['cities', search],
    queryFn: () => fetch(`/api/cities?search=${search}`).then(res => res.json()),
  });
}

// Uso en componente
function CityList() {
  const { data, isLoading, error } = useCities();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  return data.map(city => <CityCard key={city.id} city={city} />);
}
```

**Principios React Query:**
1. Cada query tiene una `queryKey` única (array).
2. React Query maneja cache, re-fetch, stale time.
3. Mutaciones (create, update, delete) usan `useMutation`.
4. Después de mutar, invalidar queries relacionadas.

### 6.4 Zustand (Estado Global)

Zustand es un **store liviano** para estado global del lado del cliente.

```typescript
// Store de autenticación
interface AuthState {
  user: User | null;
  token: string | null;
  login: (phone: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (phone) => {
    const { token, user } = await api.login(phone);
    set({ token, user });
  },
  logout: () => set({ user: null, token: null }),
}));

// Uso en componente:
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
```

**Principios Zustand:**
1. Stores pequeños y enfocados (auth, bookings, filters).
2. Acciones dentro del store (no separadas).
3. Selectors para evitar renders innecesarios.
4. Persistencia opcional con `zustand/middleware`.

### 6.5 Estructura de Directorios (Mobile)

```
frontend-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── verify-otp.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home
│   │   ├── bookings/
│   │   ├── profile/
│   │   └── search/
│   └── _layout.tsx
├── src/
│   ├── components/               # UI components reutilizables
│   │   ├── ui/                   # Botones, inputs, cards (solo NativeWind)
│   │   ├── booking/              # Componentes de reserva
│   │   └── provider/             # Componentes de prestador
│   ├── hooks/                    # Custom hooks (React Query wrappers)
│   │   ├── useCities.ts
│   │   ├── useBookings.ts
│   │   └── useAuth.ts
│   ├── services/                 # API calls
│   │   ├── api.ts                # Cliente HTTP base
│   │   ├── cities.ts
│   │   ├── bookings.ts
│   │   └── auth.ts
│   ├── stores/                   # Zustand stores
│   │   ├── authStore.ts
│   │   └── bookingStore.ts
│   ├── types/                    # Interfaces compartidas
│   │   └── index.ts
│   └── utils/                    # Helpers
│       ├── formatters.ts
│       └── validators.ts
├── app.json
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 6.6 Flujo de Datos (Mobile)

```
[Componente UI]
    │
    │ useQuery / useMutation (React Query)
    ▼
[Hook personalizado (useCities, useBookings)]
    │
    │ Llama a función en services/
    ▼
[Service (api/cities.ts)]
    │
    │ fetch() → endpoint NestJS
    ▼
[Backend API]
    │
    │ Respuesta JSON
    ▼
[React Query cache]
    │
    │ Datos disponibles en el componente
    ▼
[Componente UI renderiza]
```

---

## 7. Frontend Admin (Vite + React)

### 7.1 Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Framework | React 19 | UI declarativa |
| Bundler | Vite 6 | Dev server + build rápido |
| Lenguaje | TypeScript | Tipado estático |
| Estado global | Zustand | Store ligero |
| Data fetching | React Query (TanStack Query) | Cache y sincronización |
| UI Library | (TBD — podría ser sin librería o con shadcn/ui) |

### 7.2 Estructura de Directorios (Admin)

```
frontend-admin/
├── src/
│   ├── pages/                    # Páginas del dashboard
│   │   ├── Dashboard.tsx
│   │   ├── Cities/
│   │   │   ├── CityList.tsx
│   │   │   ├── CityForm.tsx
│   │   │   └── CityRow.tsx
│   │   ├── Services/
│   │   ├── Providers/
│   │   ├── Clients/
│   │   └── Bookings/
│   ├── components/               # UI components reutilizables
│   │   ├── ui/                   # Tabla, Modal, Form, Badge, etc.
│   │   └── layout/               # Sidebar, Header, Layout
│   ├── hooks/                    # Custom hooks (React Query)
│   ├── services/                 # API calls
│   ├── stores/                   # Zustand stores
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Helpers
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 7.3 Patrón de Página (Admin)

```tsx
// Cada página sigue este patrón:
function CityList() {
  // 1. React Query para obtener datos
  const { data: cities, isLoading, error } = useQuery({
    queryKey: ['cities'],
    queryFn: () => citiesService.getAll(),
  });

  // 2. Mutation para crear/editar/eliminar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => citiesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cities'] }),
  });

  // 3. Render
  if (isLoading) return <Spinner />;
  return (
    <div>
      <DataTable data={cities} onDelete={deleteMutation.mutate} />
    </div>
  );
}
```

---

## 8. Flujo de Datos Completo

### 8.1 Flujo General

```
[Cliente Mobile/Admin Web]
       │
       │ HTTP Request (JSON)
       ▼
[CORS] ──► [ValidationPipe] ──► [Controller]
                                      │
                                      │ Delegación
                                      ▼
                                   [Service]
                                      │
                              ┌───────┴───────┐
                              │               │
                              ▼               ▼
                      [PrismaService]   [Twilio]
                              │               │
                              ▼               ▼
                       [PostgreSQL]      [SMS al usuario]
                              │
                              ▼
                        [Response JSON]
                              │
                              ▼
                       [Cliente recibe datos]
```

### 8.2 Flujo de Error

```
[Petición inválida]
       │
       ▼
[ValidationPipe]
       │
       ├── whitelist: true → elimina campos extra
       ├── forbidNonWhitelisted: true → 400 si hay campos extra
       └── transform: true → convierte tipos
       │
       ▼
[Controller] → [Service] → throw NotFoundException/ConflictException
       │
       ▼
[AllExceptionsFilter]
       │
       ├── ¿Es HttpException? → usa su status y message
       └── ¿Es Error inesperado? → loguea stack, retorna 500
       │
       ▼
[Response JSON]: { statusCode, message, timestamp }
```

### 8.3 Flujo de OTP (Caso Completo)

```
[Usuario]             [Mobile App]               [Backend]                  [Twilio]       [DB]
   │                       │                        │                        │              │
   │  Ingresa teléfono     │                        │                        │              │
   ├──────────────────────▶│                        │                        │              │
   │                       │  POST /sms/otp/send    │                        │              │
   │                       ├───────────────────────▶│                        │              │
   │                       │                        │  randomInt(100000,     │              │
   │                       │                        │    999999)             │              │
   │                       │                        │  expiresAt = now+10min │              │
   │                       │                        ├───────────────────────▶│              │
   │                       │                        │  INSERT Otp {code,     │              │
   │                       │                        │           expiresAt}   │              │
   │                       │                        ├──────────────────────────────────────▶│
   │                       │                        │                        │              │
   │                       │                        │  SMS: "Código: 123456" │              │
   │                       │                        ├───────────────────────▶│              │
   │                       │                        │                        │  SMS al      │
   │                       │                        │                        │  teléfono    │
   │   Recibe SMS          │                        │                        │              │
   │◀──────────────────────│                        │                        │              │
   │                       │                        │                        │              │
   │  Ingresa código       │                        │                        │              │
   ├──────────────────────▶│                        │                        │              │
   │                       │  POST /sms/otp/verify  │                        │              │
   │                       ├───────────────────────▶│                        │              │
   │                       │                        │  SELECT Otp WHERE      │              │
   │                       │                        │    phone AND NOT        │              │
   │                       │                        │    verified AND         │              │
   │                       │                        │    expiresAt > now      │              │
   │                       │                        ├──────────────────────────────────────▶│
   │                       │                        │◀──────────────────────────────────────┤
   │                       │                        │                        │              │
   │                       │                        │  ¿code match?           │              │
   │                       │                        │  ¿attempts < 5?         │              │
   │                       │                        │                        │              │
   │                       │                        │  Si OK: UPDATE verified │              │
   │                       │                        ├──────────────────────────────────────▶│
   │                       │                        │                        │              │
   │                       │  200 { verified: true } │                        │              │
   │                       │◀───────────────────────│                        │              │
   │   Verificación exitosa│                        │                        │              │
   │◀──────────────────────│                        │                        │              │
```

---

## 9. Buenas Prácticas Arquitectónicas

### 9.1 Principios Generales

| Principio | Aplicación |
|-----------|-----------|
| **DRY** (Don't Repeat Yourself) | Lógica repetida → método privado en el servicio |
| **KISS** (Keep It Simple) | Preferir funciones simples sobre abstracciones complejas |
| **YAGNI** (You Ain't Gonna Need It) | No agregar funcionalidad hasta que sea necesaria |
| **Separation of Concerns** | Controller ≠ Service ≠ Repository |
| **Single Responsibility** | Cada clase tiene un solo motivo para cambiar |
| **Dependency Inversion** | Depender de abstracciones, no de implementaciones |

### 9.2 Buenas Prácticas Backend

#### Estructura

- **Un módulo por funcionalidad de negocio** (Cities, Clients, Bookings).
- **No mezclar funcionalidades** en el mismo módulo.
- **No crear carpetas técnicas** (controllers/, services/) fuera de los módulos.

#### Controladores

- **Mínima lógica**: solo extraer parámetros y delegar.
- **No instanciar servicios** manualmente — usar DI.
- **No manejar transacciones** — eso es del servicio.

#### Servicios

- **Métodos asíncronos** siempre (incluso si no hacen await).
- **Validar todo** antes de modificar datos.
- **Usar include** para devolver relaciones relevantes.
- **Error temprano**: validar existencia/unicidad al inicio.

#### DTOs

- **Validar en frontera**: class-validator en todas las propiedades.
- **Documentar con Swagger**: @ApiProperty en todas las propiedades.
- **Separar por operación**: Create ≠ Update ≠ Query.

### 9.3 Buenas Prácticas Frontend Mobile

#### Componentes

- **Un componente por archivo**.
- **Componentes pequeños** (< 200 líneas).
- **Separar UI de lógica**: componentes presentacionales sin hooks.
- **NativeWind para todos los estilos**: no StyleSheet.

#### Estado

- **React Query para datos del servidor** (fetch, cache, mutate).
- **Zustand para estado del cliente** (auth, UI state).
- **Estado local** (useState) para UI efímera (modales, inputs).

#### API Calls

- **Un archivo por recurso** (cities.ts, bookings.ts).
- **Errores manejados** con try/catch y mostrados al usuario.
- **Tipos compartidos** con el backend (interfaces en types/).

### 9.4 Buenas Prácticas de Base de Datos

- **UUID como IDs** (no autoincrement).
- **Índices en campos de filtrado** (status, isAvailable, cityId).
- **Cascade delete solo cuando tenga sentido** (ej: Review → Booking).
- **Mantener el esquema normalizado** hasta que haya razón para desnormalizar.
- **Una migración por cambio** — no acumular cambios.

### 9.5 Buenas Prácticas de Seguridad

- **Validar todo input** en DTOs + ValidationPipe.
- **OTP con crypto.randomInt()**, no Math.random().
- **Rate limiting**: 5 intentos por OTP.
- **JWT_SECRET validado al iniciar** — la app no arranca sin él.
- **CORS restrictivo**: solo orígenes conocidos.
- **No exponer stack traces** en producción.

---

## 10. Resumen de Patrones Arquitectónicos

| Patrón | Dónde se usa | Implementación |
|--------|-------------|----------------|
| **MVC** | Backend (NestJS) | Controller (View/HTTP) → Service (Model) |
| **Feature First** | Backend | Cada funcionalidad es un módulo autónomo |
| **Repository** | Backend | PrismaService como capa de acceso a datos |
| **DTO** | Backend | Clases con class-validator + Swagger |
| **DI (Dependency Injection)** | Backend | Contenedor IoC de NestJS |
| **Singleton** | Backend | Services, PrismaService, ConfigService |
| **Observer** | Backend | RxJS (Observables) para eventos |
| **Adapter** | Backend | Twilio adapter (misma interfaz si configurado o no) |
| **Global Exception Filter** | Backend | AllExceptionsFilter (@Catch()) |
| **Custom Hooks** | Frontend | useCities, useBookings (React Query wrappers) |
| **Store Pattern** | Frontend | Zustand stores (auth, booking) |
| **Service Layer** | Frontend | services/api.ts, services/cities.ts |
| **File-based Routing** | Mobile | Expo Router (app/ directory) |

---

*Documento de arquitectura — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
