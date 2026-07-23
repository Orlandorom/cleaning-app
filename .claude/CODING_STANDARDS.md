# Coding Standards — Cleaning App

> Reglas estrictas de codificación para todo el proyecto. Cualquier desviación debe ser justificada y aprobada.

---

## Índice

1. [Lenguaje y Entorno](#1-lenguaje-y-entorno)
2. [Naming Conventions](#2-naming-conventions)
3. [Estructura de Carpetas y Archivos](#3-estructura-de-carpetas-y-archivos)
4. [TypeScript: Reglas Estrictas](#4-typescript-reglas-estrictas)
5. [NestJS: Backend](#5-nestjs-backend)
6. [DTOs y Validación](#6-dtos-y-validación)
7. [Controladores](#7-controladores)
8. [Servicios](#8-servicios)
9. [Repository Pattern](#9-repository-pattern)
10. [Prisma y Base de Datos](#10-prisma-y-base-de-datos)
11. [Manejo de Errores](#11-manejo-de-errores)
12. [Swagger y Documentación](#12-swagger-y-documentación)
13. [Limpieza de Código](#13-limpieza-de-código)
14. [Frontend Mobile: React Native + Expo](#14-frontend-mobile-react-native--expo)
15. [Frontend Admin: React + Vite](#15-frontend-admin-react--vite)
16. [React Query: Reglas](#16-react-query-reglas)
17. [Zustand: Reglas](#17-zustand-reglas)
18. [Convenciones Git](#18-convenciones-git)
19. [Checklist de Código](#19-checklist-de-código)

---

## 1. Lenguaje y Entorno

| Regla | Valor |
|-------|-------|
| Lenguaje principal | **TypeScript** (estrictamente tipado) |
| Versión TypeScript | ^5.7 |
| Módulos | CommonJS (backend), ESM (frontends) |
| Runtime backend | Node.js >= 18 |
| Package manager | npm |
| Formateo | ESLint + Prettier (configuración estándar) |

## 2. Naming Conventions

### 2.1 Reglas Generales

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Archivos** | `kebab-case` | `create-city.dto.ts`, `cities.service.ts` |
| **Carpetas** | `kebab-case` | `dto/`, `common/filters/` |
| **Clases** | `PascalCase` | `CitiesService`, `CreateCityDto`, `AllExceptionsFilter` |
| **Interfaces** | `PascalCase` (sin prefijo I) | `CityResponse`, `BookingFilters` |
| **Tipos** | `PascalCase` | `ServiceType`, `BookingStatus` |
| **Enums** | `PascalCase` (nombre), `UPPER_SNAKE_CASE` (valores) | `BookingStatus.PENDING` |
| **Funciones/Métodos** | `camelCase` | `findAll()`, `create()`, `sendOtp()` |
| **Variables** | `camelCase` | `const cityName`, `let isAvailable` |
| **Constantes** | `UPPER_SNAKE_CASE` | `const MAX_ATTEMPTS = 5` |
| **Parámetros** | `camelCase` | `(dto: CreateCityDto)`, `(id: string)` |
| **Propiedades DTO** | `camelCase` | `@ApiProperty() name: string` |
| **Decoradores** | `@camelCase` | `@Injectable()`, `@Controller()` |

### 2.2 Reglas Específicas por Tipo de Archivo

```
*.service.ts       → CitiesService, ClientsService, OtpService
*.controller.ts    → CitiesController, ClientsController, SmsController
*.module.ts        → CitiesModule, PrismaModule, AppModule
create-*.dto.ts    → CreateCityDto, CreateBookingDto
update-*.dto.ts    → UpdateCityDto, UpdateBookingDto
query-*.dto.ts     → QueryCityDto, QueryBookingDto
*.spec.ts          → cities.service.spec.ts (nombre del archivo que prueba)
*.filter.ts        → AllExceptionsFilter
```

### 2.3 Nombres de Métodos en Servicios

| Método | Propósito | Firma |
|--------|-----------|-------|
| `create` | Crear un nuevo registro | `async create(dto: CreateDto): Promise<Entity>` |
| `findAll` | Listar registros con filtros | `async findAll(query?: QueryDto): Promise<Entity[]>` |
| `findOne` | Buscar un registro por ID | `async findOne(id: string): Promise<Entity>` |
| `update` | Actualizar un registro | `async update(id: string, dto: UpdateDto): Promise<Entity>` |
| `remove` | Eliminar un registro | `async remove(id: string): Promise<Entity>` |

### 2.4 Nombres de Endpoints (Controladores)

```
POST   /{recurso}        → create(@Body() dto: CreateDto)
GET    /{recurso}        → findAll(@Query() query?: QueryDto)
GET    /{recurso}/:id    → findOne(@Param('id') id: string)
PATCH  /{recurso}/:id    → update(@Param('id') id: string, @Body() dto: UpdateDto)
DELETE /{recurso}/:id    → remove(@Param('id') id: string)
```

## 3. Estructura de Carpetas y Archivos

### 3.1 Backend: Feature First

```
src/{feature}/
├── dto/                          # DTOs de la feature
│   ├── create-{entity}.dto.ts
│   ├── update-{entity}.dto.ts
│   └── query-{entity}.dto.ts
├── {entities}.service.ts         # Lógica de negocio
├── {entities}.controller.ts      # Endpoints HTTP
├── {entities}.module.ts          # Registro del módulo
├── {entities}.service.spec.ts    # Tests del servicio
└── {entities}.controller.spec.ts # Tests del controlador
```

### 3.2 Frontend Mobile: Feature First

```
src/
├── components/{feature}/         # Componentes UI de la feature
├── hooks/use{Feature}.ts         # Custom hooks (React Query wrappers)
├── services/{feature}.ts         # API calls
├── stores/{feature}Store.ts      # Zustand stores
├── types/index.ts                # Interfaces y tipos
└── utils/                        # Utilidades generales
```

### 3.3 Reglas de Estructura

1. **Un módulo = una carpeta** en `src/`.
2. **Un archivo = una responsabilidad** (una clase o función principal).
3. **Máximo 300 líneas por archivo** (si excede, dividir).
4. **No crear carpetas vacías**.
5. **No mezclar features** en la misma carpeta.

## 4. TypeScript: Reglas Estrictas

### 4.1 Regla Fundamental: No Usar `any`

```typescript
// ❌ INCORRECTO — cualquier tipo sin restricción
async function process(data: any): Promise<any> {
  return data.result;
}

// ✅ CORRECTO — tipos explícitos
async function process(data: ProcessInput): Promise<ProcessOutput> {
  return data.result;
}
```

**Excepciones (solo cuando no hay alternativa):**
- Mocks en tests (usar `jest.fn()` que ya infiere tipos).
- `catch (error: unknown)` — usar `unknown`, no `any`.

### 4.2 Tipado Explícito vs Inferido

```typescript
// ✅ CORRECTO — tipo explícito en retorno de métodos públicos
async findOne(id: string): Promise<City> {
  return this.prisma.city.findUnique({ where: { id } });
}

// ✅ CORRECTO — tipo inferido en variables locales (cuando es obvio)
const city = await this.findOne(id);  // TypeScript infiere City

// ❌ INCORRECTO — tipo explícito innecesario en variable local obvia
const city: City = await this.findOne(id);
```

### 4.3 Tipos Genéricos

```typescript
// ❌ INCORRECTO — perder tipos
async findAll(): Promise<any[]> {
  return this.prisma.city.findMany();
}

// ✅ CORRECTO — usar tipos de Prisma
async findAll(): Promise<City[]> {
  return this.prisma.city.findMany();
}
```

### 4.4 Tipos de uniones vs enums

```typescript
// ❌ INCORRECTO — string literal sin tipo
type Status = 'PENDING' | 'CONFIRMED';

// ✅ CORRECTO — usar enums de Prisma
import { BookingStatus } from '@prisma/client';
```

### 4.5 Uso de `unknown`

```typescript
// ❌ INCORRECTO — perder información
catch (error: any) {
  console.log(error.message);
}

// ✅ CORRECTO — usar unknown y hacer type guard
catch (error: unknown) {
  if (error instanceof HttpException) {
    throw error;
  }
  this.logger.error(error);
  throw new InternalServerErrorException();
}
```

### 4.6 Tipos en Tests

```typescript
// ❌ INCORRECTO — mock sin tipo
const mockPrisma = { city: { findMany: jest.fn() } };

// ✅ CORRECTO — tipar los mocks (aunque sean parciales)
const mockPrisma = {
  city: {
    findMany: jest.fn<Promise<City[]>, []>(),
    findUnique: jest.fn<Promise<City | null>, [{ where: { id: string } }]>(),
  },
};
```

### 4.7 `strictNullChecks`

```typescript
// ❌ INCORRECTO — asumir que no es null sin verificar
const city = await this.prisma.city.findUnique({ where: { id } });
return city.name;  // city podría ser null, Error TS!

// ✅ CORRECTO — verificar null antes de acceder
const city = await this.prisma.city.findUnique({ where: { id } });
if (!city) throw new NotFoundException();
return city.name;
```

## 5. NestJS: Backend

### 5.1 Decoradores de Clase

```typescript
// Servicio — siempre @Injectable()
@Injectable()
export class CitiesService {}

// Controlador — siempre @Controller + @ApiTags
@ApiTags('Cities')
@Controller('cities')
export class CitiesController {}

// Módulo
@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
```

### 5.2 Inyección de Dependencias

```typescript
// ✅ CORRECTO — inyección via constructor con private readonly
@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
}

// ❌ INCORRECTO — instanciación manual
@Injectable()
export class CitiesService {
  private prisma: PrismaService;
  constructor() {
    this.prisma = new PrismaService();  // NO — rompe DI
  }
}

// ❌ INCORRECTO — uso incorrecto de modificador de acceso
constructor(
  prisma: PrismaService,        // Falta private
  public config: ConfigService, // No debe ser público
) {}
```

### 5.3 Ámbito de Proveedores

```typescript
// Default (Singleton) — para la mayoría de servicios
@Injectable()  // scope: Scope.DEFAULT
export class CitiesService {}

// Request — solo cuando se necesita datos de la petición (raro)
@Injectable({ scope: Scope.REQUEST })
export class RequestService {}
```

**Regla:** 99% de los servicios usan el ámbito Singleton (default). No cambiar a menos que sea estrictamente necesario.

### 5.4 Módulos

```typescript
// ✅ CORRECTO — feature module
@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}

// ❌ INCORRECTO — importar módulos globales innecesariamente
@Module({
  imports: [PrismaModule, ConfigModule],  // Son globales, no hacen falta
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
```

## 6. DTOs y Validación

### 6.1 Regla Obligatoria

**TODO DTO debe tener:**
1. Decoradores `class-validator` en CADA propiedad.
2. Decoradores `@nestjs/swagger` (`@ApiProperty` o `@ApiPropertyOptional`) en CADA propiedad.

```typescript
// ✅ CORRECTO — DTO completo
export class CreateServiceDto {
  @ApiProperty({ example: 'Limpieza general', description: 'Nombre del servicio', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Servicio completo para hogares', description: 'Descripción' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'GENERAL', description: 'Tipo de servicio', enum: ServiceType })
  @IsEnum(ServiceType)
  @IsNotEmpty()
  type: ServiceType;

  @ApiProperty({ example: 120, description: 'Duración en minutos', minimum: 15 })
  @IsInt()
  @Min(15)
  duration: number;
}

// ❌ INCORRECTO — DTO incompleto
export class CreateServiceDto {
  name: string;           // Sin validación ni Swagger
  description?: string;   // Sin validación ni Swagger
  type: string;           // Sin validación ni Swagger
  duration: number;       // Sin validación ni Swagger
}
```

### 6.2 Orden de Decoradores

```typescript
// 1. Swagger (primero, para documentación)
@ApiProperty({ example: 'Bogotá', description: 'Nombre de la ciudad' })
// 2. Tipo (class-validator)
@IsString()
// 3. Presencia
@IsNotEmpty()
// 4. Formato/Longitud (si aplica)
@MinLength(2)
@MaxLength(100)
name: string;
```

### 6.3 Propiedades Opcionales

```typescript
// ✅ CORRECTO — @IsOptional() es el PRIMER decorador de validación
@ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
@IsOptional()          // ← Primero: permite que sea undefined
@IsString()            // ← Segundo: si está presente, debe ser string
@IsEmail()             // ← Tercero: si está presente, debe ser email válido
email?: string;
```

### 6.4 DTOs de Actualización

```typescript
// ✅ CORRECTO — Siempre usar PartialType de @nestjs/swagger
import { PartialType } from '@nestjs/swagger';

export class UpdateCityDto extends PartialType(CreateCityDto) {}
// Esto automáticamente:
// 1. Hace todas las propiedades opcionales
// 2. Mantiene los decoradores Swagger (como optional)
// 3. Hereda la validación

// ❌ INCORRECTO — redefinir manualmente
export class UpdateCityDto {
  @IsOptional()
  @IsString()
  name?: string;
  // Si CreateCityDto cambia, hay que actualizar esto manualmente
}
```

### 6.5 DTOs de Consulta (Filtros)

```typescript
// ✅ CORRECTO — todos los campos son @IsOptional()
export class QueryProviderDto {
  @ApiPropertyOptional({ example: 'Juan', description: 'Buscar por nombre' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por disponibilidad' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
```

### 6.6 Validación Personalizada (Fechas)

```typescript
// Para campos de fecha que se reciben como string ISO
@ApiProperty({ example: '2026-08-01T14:00:00Z', description: 'Fecha programada' })
@IsString()
@IsNotEmpty()
scheduledAt: string;   // Se convierte a Date en el servicio
```

### 6.7 Validación de Enums

```typescript
// ✅ CORRECTO — @IsEnum con el enum de Prisma
import { ServiceType } from '@prisma/client';

@ApiProperty({ example: 'GENERAL', description: 'Tipo de servicio', enum: ServiceType })
@IsEnum(ServiceType)
@IsNotEmpty()
type: ServiceType;
```

## 7. Controladores

### 7.1 Regla Fundamental

**Los controladores NO tienen lógica de negocio.** Su única responsabilidad es manejar la interacción HTTP y delegar al servicio.

```typescript
// ✅ CORRECTO — controlador delgado
@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una ciudad' })
  @ApiResponse({ status: 201, description: 'Ciudad creada' })
  @ApiResponse({ status: 409, description: 'La ciudad ya existe' })
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ciudades' })
  @ApiResponse({ status: 200, description: 'Lista de ciudades' })
  findAll(@Query() query?: QueryCityDto) {
    return this.citiesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ciudad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({ status: 200, description: 'Ciudad encontrada' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({ status: 200, description: 'Ciudad actualizada' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  @ApiResponse({ status: 409, description: 'El nombre ya existe' })
  update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.citiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({ status: 200, description: 'Ciudad eliminada' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
```

### 7.2 Lo que NO debe estar en un Controlador

```typescript
// ❌ INCORRECTO — lógica de negocio en el controlador
@Get(':id')
async findOne(@Param('id') id: string) {
  const city = await this.prisma.city.findUnique({ where: { id } });  // NO: acceso directo a DB
  if (!city) {
    throw new NotFoundException();                                      // NO: esta lógica es del servicio
  }
  return city;
}

// ❌ INCORRECTO — transformación de datos en controlador
@Get()
async findAll() {
  const cities = await this.citiesService.findAll();
  return cities.map(c => ({ label: c.name, value: c.id }));  // NO: transformar en el servicio
}

// ❌ INCORRECTO — condicionales de negocio en controlador
@Patch(':id')
async update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
  if (dto.name) {
    // validación de unicidad aquí...  // NO: eso va en el servicio
  }
  return this.citiesService.update(id, dto);
}
```

### 7.3 Manejo de Respuestas en Controladores

```typescript
// ✅ CORRECTO — el controlador retorna directamente lo que devuelve el servicio
create(@Body() dto: CreateCityDto) {
  return this.citiesService.create(dto);
  // NestJS serializa automáticamente a JSON
  // El status code es 201 por defecto para POST
}

// ✅ CORRECTO — solo usar @HttpCode si el default no aplica
@Delete(':id')
@HttpCode(200)  // DELETE por defecto retorna 204, queremos 200
remove(@Param('id') id: string) {
  return this.citiesService.remove(id);
}
```

## 8. Servicios

### 8.1 Regla Fundamental

**Los servicios contienen TODA la lógica de negocio.** Son la capa más importante de la aplicación.

### 8.2 Patrón de Servicio CRUD

```typescript
@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // --- CREATE ---
  // 1. Validar unicidad (si aplica)
  // 2. Crear
  // 3. Retornar con include
  async create(dto: CreateCityDto): Promise<City> {
    const existing = await this.prisma.city.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(`La ciudad "${dto.name}" ya existe`);
    }
    return this.prisma.city.create({ data: dto });
  }

  // --- FIND ALL ---
  // Construir where dinámicamente según query params
  async findAll(query?: QueryCityDto): Promise<City[]> {
    const where = query?.search
      ? { name: { contains: query.search, mode: 'insensitive' as const } }
      : {};
    return this.prisma.city.findMany({ where, orderBy: { name: 'asc' } });
  }

  // --- FIND ONE ---
  // 1. Buscar por ID
  // 2. Si no existe → NotFoundException
  // 3. Retornar
  async findOne(id: string): Promise<City> {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Ciudad con id "${id}" no encontrada`);
    }
    return city;
  }

  // --- UPDATE ---
  // 1. Validar existencia (reutilizar findOne)
  // 2. Validar unicidad si cambia campo único
  // 3. Actualizar
  async update(id: string, dto: UpdateCityDto): Promise<City> {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.city.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`La ciudad "${dto.name}" ya existe`);
      }
    }
    return this.prisma.city.update({ where: { id }, data: dto });
  }

  // --- REMOVE ---
  // 1. Validar existencia (reutilizar findOne)
  // 2. Eliminar
  async remove(id: string): Promise<City> {
    await this.findOne(id);
    return this.prisma.city.delete({ where: { id } });
  }
}
```

### 8.3 Reutilización de Métodos

```typescript
// ✅ CORRECTO — update y remove reutilizan findOne para validar existencia
async update(id: string, dto: UpdateDto): Promise<Entity> {
  await this.findOne(id);  // ← Reutiliza validación
  // ... resto de la lógica
}

async remove(id: string): Promise<Entity> {
  await this.findOne(id);  // ← Reutiliza validación
  return this.prisma.entity.delete({ where: { id } });
}

// ❌ INCORRECTO — duplicar lógica de validación
async update(id: string, dto: UpdateDto): Promise<Entity> {
  const entity = await this.prisma.entity.findUnique({ where: { id } });
  if (!entity) throw new NotFoundException();  // ← DUPLICADO
  // ...
}

async remove(id: string): Promise<Entity> {
  const entity = await this.prisma.entity.findUnique({ where: { id } });
  if (!entity) throw new NotFoundException();  // ← DUPLICADO
  // ...
}
```

### 8.4 No Duplicar Lógica

```typescript
// ❌ INCORRECTO — lógica repetida en varios servicios
// En CitiesService:
async create(dto: CreateCityDto) {
  const existing = await this.prisma.city.findUnique({ where: { name: dto.name } });
  if (existing) throw new ConflictException();
  // ...
}

// ❌ INCORRECTO — lógica similar duplicada en otro servicio
async create(dto: CreateServiceDto) {
  const existing = await this.prisma.service.findUnique({ where: { name: dto.name } });
  if (existing) throw new ConflictException();
  // ...
}

// ✅ CORRECTO — la duplicación es aceptable porque la lógica difiere en el campo único
// (cada entidad tiene su propia regla de unicidad: City.name vs Service.name vs Provider.phone)
// PERO el patrón ESTRUCTURAL debe ser idéntico.
```

### 8.5 Transacciones

```typescript
// Para operaciones que afectan múltiples tablas, usar $transaction
async createBookingWithReview(dto: CreateBookingDto): Promise<Booking> {
  return this.prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({ data: dto });
    // Más operaciones dentro de la misma transacción
    return booking;
  });
}
```

## 9. Repository Pattern

### 9.1 Regla Fundamental

**PrismaService es la única capa de acceso a datos.** Los servicios NO acceden directamente a la base de datos ni construyen SQL.

```typescript
// ✅ CORRECTO — PrismaService como repositorio
@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<City> {
    return this.prisma.city.findUnique({ where: { id } });
  }
}

// ❌ INCORRECTO — acceso directo sin PrismaService
@Injectable()
export class CitiesService {
  constructor() {}  // No inyecta PrismaService

  async findOne(id: string): Promise<any> {
    // Intentar conectar directamente o usar otro ORM  // NO
  }
}
```

### 9.2 Operaciones de Repositorio

| Operación | Método Prisma | Uso |
|-----------|--------------|-----|
| Buscar por ID | `findUnique({ where: { id } })` | Obtener una entidad por clave primaria |
| Buscar por único | `findUnique({ where: { field } })` | Validar unicidad de email, teléfono, nombre |
| Listar | `findMany({ where, orderBy, include })` | Listar con filtros opcionales |
| Buscar primero | `findFirst({ where, orderBy })` | Obtener el último registro (ej: OTP más reciente) |
| Crear | `create({ data })` | Insertar nuevo registro |
| Actualizar | `update({ where: { id }, data })` | Modificar registro existente |
| Eliminar | `delete({ where: { id } })` | Eliminar registro |
| Contar | `count({ where })` | Obtener cantidad de registros |
| Transacción | `$transaction([...])` | Operaciones atómicas multi-tabla |

### 9.3 Incluir Relaciones

```typescript
// ✅ CORRECTO — incluir relaciones relevantes en cada operación CRUD
@Injectable()
export class BookingsService {
  async create(dto: CreateBookingDto): Promise<Booking> {
    return this.prisma.booking.create({
      data: { /* ... */ },
      include: { client: true, provider: true, service: true },  // ← Siempre incluir
    });
  }
}

// ❌ INCORRECTO — no incluir relaciones, obligando a queries adicionales
async create(dto: CreateBookingDto): Promise<Booking> {
  const booking = await this.prisma.booking.create({ data: dto });
  // El controlador/cliente ahora necesita hacer otra llamada para obtener datos relacionados
  return booking;
}
```

### 9.4 Ordenar Resultados

```typescript
// ✅ CORRECTO — siempre ordenar listas
return this.prisma.provider.findMany({
  orderBy: { name: 'asc' },  // ← Siempre ordenado
});

return this.prisma.booking.findMany({
  orderBy: { scheduledAt: 'desc' },  // ← Más reciente primero
});

// ❌ INCORRECTO — resultado sin orden (orden impredecible)
return this.prisma.provider.findMany();
```

## 10. Prisma y Base de Datos

### 10.1 Regla Fundamental

**Solo los Services acceden a PrismaService.** Los Controllers nunca deben usar PrismaService directamente.

```typescript
// ✅ CORRECTO
@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}
  // ↑ Único lugar donde se inyecta PrismaService
}

// ❌ INCORRECTO — Controller usando PrismaService directamente
@Controller('cities')
export class CitiesController {
  constructor(private readonly prisma: PrismaService) {}  // NO!
}
```

### 10.2 Queries Tipadas

```typescript
// ✅ CORRECTO — métodos tipados de Prisma
this.prisma.city.findUnique({ where: { id } });
this.prisma.city.findMany({ where: { name: { contains: search } } });

// ❌ INCORRECTO — raw queries (solo en casos extremos)
this.prisma.$queryRaw`SELECT * FROM City WHERE name LIKE ${search}`;
```

### 10.3 Filtros Dinámicos

```typescript
// ✅ CORRECTO — construir where object dinámicamente
async findAll(query?: QueryProviderDto): Promise<Provider[]> {
  const where: Prisma.ProviderWhereInput = {};  // ← Usar tipo de Prisma
  if (query?.search) {
    where.name = { contains: query.search, mode: 'insensitive' };
  }
  if (query?.isAvailable !== undefined) {
    where.isAvailable = query.isAvailable;
  }
  return this.prisma.provider.findMany({ where, include: { city: true }, orderBy: { name: 'asc' } });
}

// ❌ INCORRECTO — múltiples queries para diferentes combinaciones
async findAll(query?: QueryProviderDto): Promise<Provider[]> {
  if (query?.search && query?.isAvailable !== undefined) {
    return this.prisma.provider.findMany({ where: { name: { contains: query.search }, isAvailable: query.isAvailable } });
  }
  if (query?.search) {
    return this.prisma.provider.findMany({ where: { name: { contains: query.search } } });
  }
  if (query?.isAvailable !== undefined) {
    return this.prisma.provider.findMany({ where: { isAvailable: query.isAvailable } });
  }
  return this.prisma.provider.findMany();
}
```

### 10.4 Fechas en Queries

```typescript
// ✅ CORRECTO — convertir string ISO a Date antes de guardar
async create(dto: CreateBookingDto): Promise<Booking> {
  return this.prisma.booking.create({
    data: {
      ...dto,
      scheduledAt: new Date(dto.scheduledAt),  // ← Conversión en el servicio
    },
  });
}
```

## 11. Manejo de Errores

### 11.1 Regla Fundamental

**El manejo de errores está centralizado en el global `AllExceptionsFilter`.** Los servicios lanzan excepciones específicas de NestJS.

### 11.2 Excepciones HTTP por Tipo de Error

| Situación | Excepción | Código HTTP | Ejemplo |
|-----------|-----------|-------------|---------|
| Recurso no encontrado | `NotFoundException` | 404 | `Ciudad con id "x" no encontrada` |
| Violación de unicidad | `ConflictException` | 409 | `El teléfono "x" ya está registrado` |
| Validación de negocio | `BadRequestException` | 400 | `Código OTP incorrecto` |
| Error de autenticación | `UnauthorizedException` | 401 | (futuro) |
| Falta de permisos | `ForbiddenException` | 403 | (futuro) |
| Error interno | (no lanzar manualmente) | 500 | Capturado por AllExceptionsFilter |

### 11.3 Cómo Lanzar Excepciones

```typescript
// ✅ CORRECTO — usar constructor con mensaje descriptivo en español
throw new NotFoundException(`Ciudad con id "${id}" no encontrada`);
throw new ConflictException(`El teléfono "${phone}" ya está registrado`);
throw new BadRequestException('Código OTP incorrecto');

// ❌ INCORRECTO — mensajes genéricos o en inglés
throw new NotFoundException('Not found');
throw new ConflictException('Duplicate entry');
```

### 11.4 No Silenciar Errores

```typescript
// ❌ INCORRECTO — try/catch vacío silencia errores
try {
  await this.prisma.city.create({ data: dto });
} catch (error) {
  // No hacer nada — el error se pierde
}

// ✅ CORRECTO — dejar que el error sePropague al AllExceptionsFilter
await this.prisma.city.create({ data: dto });
// O capturar y relanzar con contexto adicional
try {
  await this.prisma.city.create({ data: dto });
} catch (error) {
  this.logger.error(`Error creando ciudad: ${error}`);
  throw error;  // Relanzar
}
```

### 11.5 Errores de Validación (400)

Los errores de validación de DTOs son manejados automáticamente por el `ValidationPipe` global:

```json
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "name should not be empty"
  ],
  "error": "Bad Request"
}
```

No crear manejadores personalizados para errores de validación.

## 12. Swagger y Documentación

### 12.1 Regla Fundamental

**TODO endpoint debe tener decoradores Swagger.** Sin excepción.

### 12.2 Decoradores por Endpoint

```typescript
// ✅ CORRECTO — cada endpoint tiene al menos @ApiOperation + @ApiResponse
@Post()
@ApiOperation({ summary: 'Crear una ciudad' })
@ApiResponse({ status: 201, description: 'Ciudad creada exitosamente' })
@ApiResponse({ status: 409, description: 'La ciudad ya existe' })

@Get(':id')
@ApiOperation({ summary: 'Obtener una ciudad por ID' })
@ApiParam({ name: 'id', description: 'ID de la ciudad' })
@ApiResponse({ status: 200, description: 'Ciudad encontrada' })
@ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
```

### 12.3 Decoradores en DTOs

```typescript
// ✅ CORRECTO — @ApiProperty en propiedades requeridas
@ApiProperty({ example: 'Bogotá', description: 'Nombre de la ciudad', minLength: 2, maxLength: 100 })
name: string;

// ✅ CORRECTO — @ApiPropertyOptional en propiedades opcionales
@ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
email?: string;

// ✅ CORRECTO — enum documentado
@ApiProperty({ example: 'GENERAL', description: 'Tipo de servicio', enum: ServiceType })
type: ServiceType;
```

### 12.4 Qué Documentar

| Elemento | Decorador | Obligatorio |
|----------|-----------|-------------|
| Endpoint | `@ApiOperation({ summary })` | ✅ Sí |
| Respuesta exitosa | `@ApiResponse({ status, description })` | ✅ Sí |
| Respuesta de error | `@ApiResponse({ status, description })` | ✅ Sí |
| Parámetro de ruta | `@ApiParam({ name, description })` | ✅ Sí |
| Query params | Decoradores en QueryDto | ✅ Sí |
| Body | Decoradores en CreateDto/UpdateDto | ✅ Sí |

## 13. Limpieza de Código

### 13.1 Sin Código Muerto

```typescript
// ❌ INCORRECTO — código comentado
// async oldMethod() {
//   return this.prisma.city.findMany();
// }

// ❌ INCORRECTO — variables no usadas
async findOne(id: string) {
  const city = await this.prisma.city.findUnique({ where: { id } });
  const extra = 'no se usa';  // ← Variable no utilizada
  if (!city) throw new NotFoundException();
  return city;
}

// ❌ INCORRECTO — imports no usados
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
// Logger no se usa en este archivo
```

### 13.2 Sin Console.log

```typescript
// ❌ INCORRECTO — console.log en producción
console.log('Ciudad creada:', city);

// ✅ CORRECTO — Logger de NestJS
private readonly logger = new Logger(CitiesService.name);
this.logger.log(`Ciudad creada: ${city.id}`);
```

### 13.3 Sin Valores Mágicos

```typescript
// ❌ INCORRECTO — número mágico sin explicación
if (attempts >= 5) throw new BadRequestException();

// ✅ CORRECTO — constante con nombre descriptivo
const MAX_OTP_ATTEMPTS = 5;
if (attempts >= MAX_OTP_ATTEMPTS) throw new BadRequestException();
```

### 13.4 Funciones Pequeñas

```typescript
// ✅ CORRECTO — método con una sola responsabilidad
async create(dto: CreateCityDto): Promise<City> {
  await this.validateUniqueName(dto.name);
  return this.prisma.city.create({ data: dto });
}

private async validateUniqueName(name: string): Promise<void> {
  const existing = await this.prisma.city.findUnique({ where: { name } });
  if (existing) {
    throw new ConflictException(`La ciudad "${name}" ya existe`);
  }
}
```

### 13.5 Sin Cadenas Largas de IF/ELSE

```typescript
// ❌ INCORRECTO — cadena de if/else
if (status === 'PENDING') { /* ... */ }
else if (status === 'CONFIRMED') { /* ... */ }
else if (status === 'IN_PROGRESS') { /* ... */ }

// ✅ CORRECTO — switch o objeto de mapeo
const statusHandlers = {
  PENDING: handlePending,
  CONFIRMED: handleConfirmed,
  IN_PROGRESS: handleInProgress,
};
statusHandlers[status]?.();
```

## 14. Frontend Mobile: React Native + Expo

### 14.1 NativeWind para Todos los Estilos

```tsx
// ✅ CORRECTO — NativeWind classes
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-800">Hola Mundo</Text>
</View>

// ❌ INCORRECTO — StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
});
```

### 14.2 Componentes Pequeños

```tsx
// ✅ CORRECTO — componente pequeño y enfocado
function CityCard({ city }: { city: City }) {
  return (
    <View className="p-4 bg-gray-50 rounded-lg mb-2">
      <Text className="text-base font-semibold">{city.name}</Text>
    </View>
  );
}

// ❌ INCORRECTO — componente que hace demasiado
function CityScreen() {
  // 100+ líneas con fetch, estado, render, etc.
}
```

### 14.3 Separar UI de Lógica

```tsx
// ✅ CORRECTO — hook separado del componente
// hooks/useCities.ts
export function useCities(search?: string) {
  return useQuery({
    queryKey: ['cities', search],
    queryFn: () => citiesService.getAll(search),
  });
}

// components/CityList.tsx — solo UI
function CityList() {
  const { data, isLoading, error } = useCities();
  if (isLoading) return <Spinner />;
  return data.map(city => <CityCard key={city.id} city={city} />);
}
```

## 15. Frontend Admin: React + Vite

### 15.1 Organización de Páginas

```tsx
// ✅ CORRECTO — estructura de página
function CityList() {
  // 1. Queries
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: () => citiesService.getAll(),
  });

  // 2. Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => citiesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cities'] }),
  });

  // 3. Render
  if (isLoading) return <Loading />;
  return <DataTable data={data} onDelete={deleteMutation.mutate} />;
}
```

## 16. React Query: Reglas

### 16.1 Custom Hooks

```typescript
// ✅ CORRECTO — cada recurso tiene su hook
export function useCities(search?: string) {
  return useQuery({
    queryKey: ['cities', search],
    queryFn: () => citiesService.getAll(search),
    staleTime: 1000 * 60 * 5,  // 5 minutos antes de re-fetch
  });
}

// ✅ CORRECTO — mutations como hooks
export function useDeleteCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => citiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });
}
```

### 16.2 Query Keys

```typescript
// Regla: [recurso, ...filtros]
['cities']                    // Todas las ciudades
['cities', search]            // Ciudades filtradas
['bookings', { clientId }]    // Reservas filtradas por cliente
['bookings', id]              // Una reserva específica
```

## 17. Zustand: Reglas

### 17.1 Stores por Funcionalidad

```typescript
// ✅ CORRECTO — store pequeño y enfocado
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, code: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (phone, code) => {
    const { token, user } = await api.auth.verifyOtp(phone, code);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
```

### 17.2 Store vs React Query

| Estado | Dónde va | Ejemplo |
|--------|----------|---------|
| Datos del servidor | **React Query** | Lista de ciudades, reservas |
| Estado de la UI | **Zustand** | Modal abierto/cerrado, filtro seleccionado |
| Estado de autenticación | **Zustand** | Token, usuario actual |
| Cache temporal | **React Query** | Resultados de búsqueda |

## 18. Convenciones Git

### 18.1 Mensajes de Commit

```
{tipo}: {descripción breve}

{tipo}: formato imperativo, presente, sin punto final
```

**Tipos:**

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige bug |
| `test` | Agregar o modificar tests |
| `docs` | Cambios en documentación |
| `chore` | Cambios en build, CI, tooling |
| `style` | Cambios de formato (espacios, commas, etc.) |
| `perf` | Mejora de rendimiento |

**Ejemplos:**

```
feat: implement cities CRUD module
fix: validate phone uniqueness on provider update
refactor: extract findOne validation to reusable method
test: add controller unit tests for bookings module
docs: update architecture diagrams
chore: configure jest with ts-jest
```

### 18.2 Ramas

- `main` — Producción, código estable.
- `develop` — Integración, features completados.
- `feature/{nombre}` — Desarrollo de features.
- `fix/{nombre}` — Corrección de bugs.

### 18.3 Qué NO Comprometer

- Archivos `.env` (ya están en `.gitignore`).
- `node_modules/`.
- Archivos de build (`dist/`).
- Archivos generados por Prisma (excepto migrations).
- Secretos o tokens.

### 18.4 Antes de Commit

```
1. git status          → Ver qué archivos cambiaron
2. npm run build       → Verificar que compile
3. npm test            → Verificar que tests pasen
4. git diff            → Revisar cambios visualmente
5. git add {archivos}  → Stage solo archivos intencionados
6. git commit -m "..." → Mensaje descriptivo
```

## 19. Checklist de Código

Antes de considerar una tarea como completada, verificar:

### 19.1 Estructura

- [ ] ¿La carpeta del módulo sigue el patrón Feature First?
- [ ] ¿Los archivos tienen nombres en `kebab-case`?
- [ ] ¿Las clases tienen nombres en `PascalCase`?

### 19.2 Código

- [ ] ¿No hay `any` en ningún lado?
- [ ] ¿No hay `console.log`?
- [ ] ¿No hay código comentado?
- [ ] ¿No hay variables/imports no usados?
- [ ] ¿No hay valores mágicos?
- [ ] ¿No hay lógica de negocio en controladores?
- [ ] ¿No hay duplicación de lógica de validación?

### 19.3 DTOs

- [ ] ¿CreateDto tiene class-validator en todas las propiedades?
- [ ] ¿CreateDto tiene Swagger en todas las propiedades?
- [ ] ¿UpdateDto extiende PartialType(CreateDto)?
- [ ] ¿QueryDto tiene todos los campos como @IsOptional()?

### 19.4 Servicios

- [ ] ¿findOne lanza NotFoundException si no existe?
- [ ] ¿create/update validan unicidad antes de escribir?
- [ ] ¿remove llama a findOne para validar existencia?
- [ ] ¿Todas las listas tienen orderBy?
- [ ] ¿Todas las respuestas incluyen relaciones relevantes?

### 19.5 Controladores

- [ ] ¿Cada endpoint tiene @ApiOperation + @ApiResponse?
- [ ] ¿Cada @Param tiene @ApiParam?
- [ ] ¿El controlador no tiene lógica de negocio?

### 19.6 Tests

- [ ] ¿Hay test de definición (`should be defined`)?
- [ ] ¿Hay test de happy path para cada método?
- [ ] ¿Hay test de error para NotFoundException?
- [ ] ¿Hay test de error para ConflictException (si aplica)?
- [ ] ¿Los mocks se limpian en beforeEach?
- [ ] ¿Los tests pasan? (`npm test`)

### 19.7 Compilación

- [ ] ¿`npm run build` compila sin errores?

---

*Este documento es parte del sistema de documentación del proyecto Cleaning App.*
*Versión: 1.0 — Julio 2026.*
