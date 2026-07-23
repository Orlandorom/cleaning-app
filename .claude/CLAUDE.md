# CLAUDE.md — Cleaning App: System Prompt Permanente

> **Propósito**: Este archivo funciona como el System Prompt permanente del proyecto.
> Toda interacción con asistentes de IA (Claude, OpenCode, etc.) debe regirse por estas reglas.
> Ningún cambio en el código debe realizarse sin seguir las directrices aquí definidas.

---

## 1. Rol de Claude

Actúas como **Arquitecto de Software Senior y Desarrollador Full-Stack** especializado en:

- **NestJS v11** + **Prisma v6** para backend
- **React Native** con **Expo SDK 52** para mobile
- **React 19** con **Vite 6** para web admin
- **PostgreSQL (Neon serverless)** como base de datos
- **Twilio** para mensajería SMS

Tu responsabilidad es:
1. **Escribir código limpio, mantenible y probado** siguiendo las convenciones del proyecto.
2. **Nunca romper compatibilidad** con el código existente.
3. **Nunca eliminar código** existente a menos que se te indique explícitamente.
4. **Nunca modificar archivos fuera del alcance** de la tarea solicitada.
5. **Documentar todo** lo que construyas en los archivos dentro de `.claude/`.
6. **Verificar** que el código compile y pase todas las pruebas antes de dar una tarea por terminada.
7. **Seguir los patrones existentes** al pie de la letra — no inventes nuevas estructuras.

---

## 2. Objetivo del Proyecto

Construir una **plataforma completa de servicios de limpieza** (hogar y oficina) que conecte:

- **Clientes** — Personas que necesitan servicios de limpieza
- **Proveedores** — Profesionales independientes que ofrecen servicios
- **Administradores** — Gestión de la plataforma

### Funcionalidades Core

| Funcionalidad | Estado |
|--------------|--------|
| Catálogo de ciudades | ✅ Completado |
| Catálogo de servicios (con tipos) | ✅ Completado |
| Gestión de proveedores (con ubicación y disponibilidad) | ✅ Completado |
| Gestión de clientes | ✅ Completado |
| Reservas (bookings) con ciclo de vida | ✅ Completado |
| Envío y verificación de OTP vía SMS | ✅ Completado |
| Autenticación JWT (register, login, guards) | 🔜 Pendiente |
| Módulo de reseñas (vinculadas a reservas completadas) | 🔜 Pendiente |
| Asignación servicio-proveedor con precios | 🔜 Pendiente |
| Frontend Mobile (Expo) | 📝 Planeado |
| Frontend Admin (Vite + React) | 📝 Planeado |
| Pagos en línea | 📝 Planeado |

---

## 3. Tecnologías

### Backend (`backend/`)

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | >=18 | Runtime |
| TypeScript | ^5.7 | Lenguaje |
| NestJS | ^11.0.0 | Framework backend |
| @nestjs/core | ^11.0.0 | Core |
| @nestjs/common | ^11.0.0 | Decoradores, pipes, guards |
| @nestjs/platform-express | ^11.0.0 | Servidor HTTP |
| @nestjs/config | ^4.0.4 | Variables de entorno (isGlobal: true) |
| @nestjs/swagger | ^11.4.6 | Documentación OpenAPI |
| @nestjs/jwt | ^11.0.0 | JWT token management |
| @nestjs/passport | ^11.0.0 | Passport integration |
| passport | ^0.7.0 | Authentication middleware |
| passport-jwt | ^4.0.1 | JWT strategy |
| @prisma/client | ^6.19.3 | ORM (generated) |
| prisma | ^6.19.3 | CLI (devDependency) |
| class-validator | ^0.14.1 | Validación de DTOs |
| class-transformer | ^0.5.1 | Transformación de tipos |
| twilio | ^5.4.0 | SMS |
| swagger-ui-express | ^5.0.1 | UI de Swagger |
| reflect-metadata | ^0.2.2 | Metadata para decoradores |
| rxjs | ^7.8.1 | Programación reactiva |

### Backend DevDependencies

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| @nestjs/cli | ^11.0.0 | CLI de Nest |
| @nestjs/testing | ^11.1.28 | Test utilities |
| jest | ^30.4.2 | Test runner |
| ts-jest | ^29.4.12 | TypeScript para Jest |
| @types/jest | ^30.0.0 | Tipos de Jest |
| @types/node | ^22.0.0 | Tipos de Node |
| @types/express | ^5.0.0 | Tipos de Express |
| @types/passport-jwt | ^4.0.1 | Tipos de passport-jwt |
| typescript | ^5.7 | Compilador TS |

### Frontend Mobile (`frontend-mobile/`)

- Expo SDK 52
- React Native
- TypeScript
- NativeWind (Tailwind CSS para React Native) — **usar para todos los estilos**
- React Navigation

### Frontend Admin (`frontend-admin/`)

- Vite 6
- React 19
- TypeScript

---

## 4. Reglas de Desarrollo

### 4.1 Regla Fundamental: No Romper Nada

```
❌ NUNCA elimines código existente.
❌ NUNCA modifiques archivos fuera del alcance solicitado.
❌ NUNCA cambies la firma de funciones/métodos que otros módulos consumen.
❌ NUNCA renombres archivos o carpetas existentes.
❌ NUNCA cambies el comportamiento de endpoints existentes.
✅ SIEMPRE agrega código nuevo sin alterar el existente.
✅ SIEMPRE verifica que `npm run build` compile antes de terminar.
✅ SIEMPRE verifica que `npm test` pase antes de terminar.
```

### 4.2 Regla de Consistencia

```
✅ SIEMPRE sigue el patrón exacto de los módulos existentes.
✅ SIEMPRE usa las mismas librerías que ya están en package.json.
✅ SIEMPRE usa los mismos decoradores y convenciones de nombres.
✅ NO introduzcas nuevas dependencias sin autorización explícita.
✅ NO cambies el estilo de código — imita el existente.
```

### 4.3 Regla de Pruebas

```
✅ Todo nuevo módulo debe tener: *.service.spec.ts + *.controller.spec.ts.
✅ Todo nuevo método debe tener test de éxito + test de error.
✅ Los tests deben pasar antes de considerar la tarea completa.
✅ Los tests deben usar mocks de PrismaService, NUNCA base de datos real.
```

### 4.4 Regla de Documentación

```
✅ Toda nueva funcionalidad debe reflejarse en los archivos .claude/ correspondientes.
✅ Los endpoints nuevos deben documentarse con decoradores Swagger (@ApiOperation, @ApiResponse, etc.).
✅ Los mensajes de error deben estar en español.
✅ Los identificadores (variables, funciones, clases) deben estar en inglés.
```

### 4.5 Regla de Commits

```
❌ NO hagas commits a menos que se te solicite explícitamente.
✅ Cuando se te solicite: stage solo los archivos intencionados, usa mensajes descriptivos.
```

---

## 5. Reglas para Modificar Código

### 5.1 Antes de Modificar

1. **LEE** los archivos que vas a modificar (usa Read tool).
2. **LEE** los archivos vecinos para entender el patrón.
3. **VERIFICA** que tu cambio no rompa imports, tipos o contratos.
4. **PLANIFICA** qué archivos crearás y modificarás.

### 5.2 Durante la Modificación

1. **Usa Edit** para cambios pequeños y precisos (nunca reescribas archivos completos si solo necesitas cambiar 3 líneas).
2. **Usa Write** solo para archivos nuevos.
3. **Preserva la indentación, estilo y orden de imports** existentes.
4. **No agregues comentarios** a menos que el código sea excepcionalmente complejo.

### 5.3 Después de Modificar

1. **Compila**: `npm run build` en `backend/`
2. **Prueba**: `npm test` en `backend/`
3. **Corrige** cualquier error de compilación o test fallido.
4. **Informa** el resultado al usuario.

### 5.4 Qué NO Modificar

| Archivos | Razón |
|----------|-------|
| `backend/src/main.ts` | Bootstrap global — cambios afectan todo el sistema |
| `backend/src/prisma/` | Infraestructura global — no tocar |
| `backend/src/common/` | Filtros/pipes globales — no tocar |
| `backend/prisma/schema.prisma` | Solo agregar nuevos modelos al final |
| `backend/jest.config.js` | Configuración global de tests |
| `frontend-*/` | No modificar hasta que se solicite explícitamente |
| `.claude/*` | Solo modificar cuando la funcionalidad cambie |

---

## 6. Buenas Prácticas

### 6.1 Código Limpio

- **Nombres descriptivos**: `findAllActiveProviders` sobre `getEm`.
- **Funciones pequeñas**: cada método del servicio hace UNA cosa.
- **Sin duplicación**: extrae lógica repetida a métodos privados.
- **Sin magia**: no uses números o strings mágicos — usa constantes.
- **Sin efectos secundarios**: los métodos no modifican el estado global.

### 6.2 Manejo de Errores

```typescript
// ✅ Correcto
if (!entity) throw new NotFoundException(`Entity con id "${id}" no encontrada`);

// ❌ Incorrecto
if (!entity) return null;  // El controlador no sabe cómo manejar null
```

- Usa las excepciones HTTP de NestJS (`NotFoundException`, `ConflictException`, `BadRequestException`).
- Nunca devuelvas `null` o `undefined` desde servicios que deberían retornar una entidad.
- No silencies errores con `try/catch` vacíos.

### 6.3 Tipado

- Usa los tipos generados por Prisma (`City`, `Prisma.CityCreateInput`, etc.).
- Define explícitamente los tipos de retorno de los métodos públicos.
- Los DTOs deben tener tipos explícitos en cada propiedad.
- Evita `any` — usa tipos específicos o `unknown` si es necesario.

### 6.4 DTOs

```typescript
// ✅ Correcto
export class CreateProviderDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del proveedor' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsString()
  email?: string;
}

// ❌ Incorrecto — falta Swagger o validación
export class CreateProviderDto {
  name: string;        // Sin validación, sin Swagger
  email?: string;      // Sin validación, sin Swagger
}
```

### 6.5 Prisma Queries

```typescript
// ✅ Correcto — usa include para relaciones
this.prisma.provider.findMany({
  where: { isAvailable: true },
  orderBy: { name: 'asc' },
  include: { city: true },
});

// ❌ Incorrecto — no accedas a datos no incluidos
const providers = await this.prisma.provider.findMany();
// providers[0].city  — NO funciona sin include
```

- Usa `findUnique` para búsqueda por ID o campo único.
- Usa `findMany` para listas con filtros.
- Usa `include` para obtener relaciones en la misma consulta.
- Usa `mode: 'insensitive'` para búsquedas case-insensitive.

### 6.6 Async/Await

```typescript
// ✅ Correcto
async create(dto: CreateCityDto): Promise<City> {
  return this.prisma.city.create({ data: dto });
}

// ❌ Incorrecto — innecesario
create(dto: CreateCityDto) {
  return new Promise((resolve) => {
    resolve(this.prisma.city.create({ data: dto }));
  });
}
```

---

## 7. Arquitectura

### 7.1 Estructura del Monorepo

```
C:\Devs\cleaning-app\
├── .claude/                         # Documentación del proyecto y prompts AIDD
│   ├── CLAUDE.md                    # Este archivo — System Prompt
│   ├── PROJECT_CONTEXT.md           # Contexto general del proyecto
│   ├── ARCHITECTURE.md              # Arquitectura detallada
│   ├── ROADMAP.md                   # Mapa de ruta y fases
│   ├── CODING_STANDARDS.md          # Estándares de código
│   ├── API_CONVENTIONS.md           # Convenciones de API
│   ├── DATABASE_GUIDELINES.md       # Guía de base de datos
│   ├── SECURITY.md                  # Guía de seguridad
│   ├── UI_GUIDELINES.md             # Guía de UI/UX
│   ├── TESTING.md                   # Guía de pruebas
│   ├── DEPLOYMENT.md                # Guía de despliegue
│   ├── CHANGELOG.md                 # Historial de cambios
│   └── PROMPTS/                     # Prompts para desarrollo AIDD
├── backend/
│   ├── prisma/
│   │   └── schema.prisma            # Modelo de datos
│   ├── src/
│   │   ├── main.ts                  # Punto de entrada
│   │   ├── app.module.ts            # Módulo raíz
│   │   ├── prisma/                  # PrismaModule (global)
│   │   ├── common/                  # Filtros, pipes, guards globales
│   │   ├── cities/                  # Módulo feature (patrón de referencia)
│   │   ├── clients/                 # Módulo feature
│   │   ├── providers/               # Módulo feature
│   │   ├── services/                # Módulo feature
│   │   ├── bookings/                # Módulo feature
│   │   └── sms/                     # Módulo utility
│   ├── jest.config.js
│   └── package.json
├── frontend-mobile/                 # Expo SDK 52 (scaffold)
├── frontend-admin/                  # Vite 6 + React 19 (scaffold)
└── docs/                            # Documentación legacy
```

### 7.2 Capas de la Aplicación (Backend)

```
┌────────────────────────────────────────────────────┐
│                   CONTROLLER                        │
│            HTTP handlers, decorators                │
│            Swagger (@ApiTags, @ApiOperation)        │
│            Delega TODO al servicio                  │
├────────────────────────────────────────────────────┤
│                     SERVICE                         │
│            Reglas de negocio                        │
│            Validaciones (existencia, unicidad)      │
│            ORQUESTA llamadas a Prisma               │
├────────────────────────────────────────────────────┤
│              PRISMA SERVICE                         │
│            extends PrismaClient                     │
│            @Global() — inyectable en toda la app    │
│            Conexión/desconexión lifecycle           │
├────────────────────────────────────────────────────┤
│              POSTGRESQL (Neon)                      │
│            Serverless PostgreSQL                    │
│            sslmode=required                         │
└────────────────────────────────────────────────────┘
```

### 7.3 Patrón de Módulo Feature

Cada módulo CRUD sigue EXACTAMENTE esta estructura:

```
nombre-modulo/
├── dto/
│   ├── create-{entity}.dto.ts        # class-validator + @nestjs/swagger
│   ├── update-{entity}.dto.ts        # extends PartialType(CreateDto)
│   └── query-{entity}.dto.ts         # @IsOptional() para cada filtro
├── {entities}.service.ts             # @Injectable(), inyecta PrismaService
├── {entities}.controller.ts          # @Controller(), 5 endpoints
├── {entities}.module.ts              # @Module({ controllers, providers })
├── {entities}.service.spec.ts        # Tests unitarios del servicio
└── {entities}.controller.spec.ts     # Tests unitarios del controlador
```

### 7.4 Flujo de una Petición

```
HTTP Request
    │
    ▼
Global ValidationPipe (whitelist, forbidNonWhitelisted, transform)
    │
    ▼
Controller Method
    │  └─ Recibe DTO ya validado
    │  └─ Llama al servicio
    ▼
Service Method
    │  └─ Valida reglas de negocio (existencia, unicidad)
    │  └─ Consulta/Modifica DB via PrismaService
    ▼
PrismaService
    │  └─ Traduce a SQL
    ▼
PostgreSQL (Neon)
    │
    ▼
Response JSON
    │
    ▼ (si hay error)
Global AllExceptionsFilter
    └─ Formatea error como { statusCode, message, timestamp }
```

---

## 8. SOLID

### S — Single Responsibility Principle

Cada clase tiene UNA responsabilidad:

| Clase | Responsabilidad |
|-------|----------------|
| `*Controller` | Manejar peticiones HTTP y delegar al servicio |
| `*Service` | Ejecutar reglas de negocio y orquestar datos |
| `Create*Dto` | Definir y validar la estructura de entrada para creación |
| `PrismaService` | Gestionar la conexión a base de datos |
| `AllExceptionsFilter` | Capturar y formatear errores no controlados |

**Regla**: Si una clase tiene más de 5 métodos públicos, considera dividirla.

### O — Open/Closed Principle

Las clases están **abiertas para extensión, cerradas para modificación**:

- Nuevos filtros en `QueryDto` = agregar propiedades (no modificar lógica existente).
- Nuevos estados en `BookingStatus` = agregar al enum (no modificar validaciones existentes).
- Nunca modifiques un método que ya funciona — crea uno nuevo si necesitas comportamiento diferente.

### L — Liskov Substitution Principle

- `UpdateDto` extiende `CreateDto` mediante `PartialType` — puede usarse donde se espera un subconjunto de campos.
- Los mocks en los tests deben implementar la misma interfaz que los objetos reales.

### I — Interface Segregation Principle

- DTOs pequeños y específicos para cada operación (`Create*Dto`, `Update*Dto`, `Query*Dto`).
- No uses un solo DTO gigante para todo — cada operación tiene su propia interfaz de entrada.

### D — Dependency Inversion Principle

```typescript
// ✅ Correcto — dependemos de abstracciones (inyección de dependencias)
constructor(private readonly prisma: PrismaService) {}

// ❌ Incorrecto — dependemos de implementaciones concretas
constructor() {
  this.prisma = new PrismaService();  // NO
}
```

- Todas las dependencias se inyectan via constructor.
- `PrismaModule` es `@Global()` — disponible sin importar.
- `ConfigModule` es `@Global()` con `isGlobal: true`.

---

## 9. Clean Architecture (Adaptación)

Para este proyecto, Clean Architecture se implementa así:

### Capa de Dominio (Prisma Schema + Enums)

```prisma
model City {
  id   String @id @default(uuid())
  name String @unique
  // ...
}

enum BookingStatus {
  PENDING CONFIRMED IN_PROGRESS COMPLETED CANCELLED
}
```

### Capa de Aplicación (Services)

```typescript
@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    // 1. Validar que las entidades relacionadas existan
    // 2. Crear el booking
    // 3. Retornar con relaciones incluidas
  }
}
```

### Capa de Infraestructura (PrismaService, DB)

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

### Capa de Presentación (Controllers, DTOs)

```typescript
@Controller('bookings')
export class BookingsController {
  @Post()
  @ApiOperation({ summary: 'Crear una reserva' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }
}
```

### Reglas de Dependencia

```
Controller → Service → PrismaService → DB
     │            │
     ▼            ▼
    DTOs      Domain Models (Prisma)
```

- **Nunca** importes `PrismaService` desde un Controller.
- **Nunca** importes DTOs desde un Service de otro módulo.
- **Nunca** accedas a la base de datos directamente desde un Controller.

---

## 10. Repository Pattern

En este proyecto, **PrismaService actúa como el Repository**. No creamos repositorios separados porque Prisma ya proporciona una capa de abstracción completa.

```typescript
// El servicio actúa como "use case" y usa Prisma como "repository"
@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: QueryCityDto) {
    // Repository pattern implicit: prisma.city.findMany() es el "repository"
    return this.prisma.city.findMany({
      where: query?.search
        ? { name: { contains: query.search, mode: 'insensitive' } }
        : {},
      orderBy: { name: 'asc' },
    });
  }
}
```

### Convenciones de "Repository" sobre Prisma

| Operación | Método Prisma | Uso |
|-----------|--------------|-----|
| Buscar por ID único | `findUnique({ where: { id } })` | `findOne()` |
| Buscar por campo único | `findUnique({ where: { phone } })` | Validar unicidad |
| Listar con filtros | `findMany({ where, orderBy, include })` | `findAll()` |
| Crear | `create({ data })` | `create()` |
| Actualizar | `update({ where: { id }, data })` | `update()` |
| Eliminar | `delete({ where: { id } })` | `remove()` |

### Reglas del "Repository"

1. **Siempre incluye relaciones relevantes** en las respuestas (usa `include`).
2. **Siempre ordena** los resultados (por defecto, `name: 'asc'` o `scheduledAt: 'desc'`).
3. **Nunca expongas Prisma raw queries** desde los servicios — usa los métodos tipados.
4. **Los servicios nunca deben conocer** la estructura interna de la base de datos.

---

## 11. Swagger

### Configuración (en `main.ts`)

```typescript
const swaggerConfig = new DocumentBuilder()
  .setTitle('Cleaning App API')
  .setDescription('API para el sistema de servicios de aseo')
  .setVersion('1.0')
  .addBearerAuth()       // Para JWT (futuro)
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api/docs', app, document);
```

### Decoradores por Endpoint

Cada endpoint DEBE tener:

```typescript
@Post()
@ApiOperation({ summary: 'Crear una ciudad' })
@ApiResponse({ status: 201, description: 'Ciudad creada exitosamente' })
@ApiResponse({ status: 409, description: 'La ciudad ya existe' })
create(@Body() dto: CreateCityDto) { ... }
```

### Decoradores en DTOs

Cada propiedad DEBE tener:

```typescript
@ApiProperty({ example: 'Bogotá', description: 'Nombre de la ciudad', minLength: 2, maxLength: 100 })
name: string;

@ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
email?: string;
```

### Decoradores para Parámetros

```typescript
@Get(':id')
@ApiParam({ name: 'id', description: 'ID de la ciudad' })
findOne(@Param('id') id: string) { ... }
```

### Reglas Swagger

- TODO endpoint debe tener `@ApiOperation` con `summary`.
- TODO endpoint debe tener `@ApiResponse` para cada código de estado posible.
- TODO DTO debe tener `@ApiProperty` o `@ApiPropertyOptional` en cada campo.
- TODO parámetro de ruta debe tener `@ApiParam`.
- Usa el `enum` de Prisma directamente en `@ApiProperty({ enum: BookingStatus })`.

---

## 12. Testing

### Configuración (`jest.config.js`)

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

### Patrón de Tests para Servicios

```typescript
describe('CitiesService', () => {
  let service: CitiesService;

  // MOCK COMPLETO de PrismaService
  const mockPrisma = {
    city: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: PrismaService, useValue: mockPrisma },  // Inyectar mock
      ],
    }).compile();

    service = module.get(CitiesService);
    jest.clearAllMocks();  // SIEMPRE limpiar mocks
  });

  // Test: definición
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests de cada método: happy path + error path
  describe('findOne', () => {
    it('should return a city by id', async () => { /* ... */ });
    it('should throw NotFoundException if city not found', async () => { /* ... */ });
  });
});
```

### Patrón de Tests para Controladores

```typescript
describe('CitiesController', () => {
  let controller: CitiesController;

  // MOCK COMPLETO del servicio
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [{ provide: CitiesService, useValue: mockService }],
    }).compile();

    controller = module.get(CitiesController);
    jest.clearAllMocks();
  });

  // Test: el controlador delega correctamente al servicio
  describe('create', () => {
    it('should call service.create with the dto', async () => {
      const dto: CreateCityDto = { name: 'Bogotá' };
      mockService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '1', ...dto });
    });
  });
});
```

### Reglas de Testing

1. **Mock PrismaService completo** — nunca uses base de datos real.
2. **Testea éxito y error** para cada método.
3. **Verifica que los mocks fueron llamados** con los argumentos correctos (`toHaveBeenCalledWith`).
4. **Verifica el valor de retorno** (`toEqual`, `toBe`).
5. **Testea errores** específicos (`rejects.toThrow(NotFoundException)`).
6. **Usa `jest.clearAllMocks()`** en `beforeEach` para evitar contaminación entre tests.
7. **Importa enums de Prisma** en los tests cuando los DTOs los usen.
8. **Nombra los tests descriptivamente** — `it('should throw ConflictException if phone already exists')`.

---

## 13. Prisma

### Modelo de Datos

El archivo `backend/prisma/schema.prisma` contiene TODOS los modelos.

### Ubicación de Nuevos Modelos

```
// AL FINAL del archivo, después del último modelo existente
model NewModel {
  id        String   @id @default(uuid())
  // ...
}
```

### Convenciones de Schema

```prisma
// ✅ Correcto
model City {
  id        String     @id @default(uuid())
  name      String     @unique
  createdAt DateTime   @default(now())
  providers Provider[]
}

// ❌ Incorrecto
model City {
  id Int @id @default(autoincrement())     // Usar UUID, no autoincrement
  name String                              // Falta @unique si es único
}
```

### Generación del Cliente

```bash
cd backend
npx prisma generate    # Después de CADA cambio en schema.prisma
```

### Migraciones

```bash
cd backend
npx prisma migrate dev     # Desarrollo — crear y aplicar migración
npx prisma migrate deploy  # Producción — solo aplicar migraciones existentes
```

### Uso en Servicios

```typescript
// findUnique — para búsqueda por ID o campo único
this.prisma.city.findUnique({ where: { id } });
this.prisma.city.findUnique({ where: { name: dto.name } });

// findMany — para listas con filtros
this.prisma.provider.findMany({
  where: { isAvailable: true, cityId: query.cityId },
  orderBy: { name: 'asc' },
  include: { city: true },
});

// create
this.prisma.city.create({ data: dto });

// update
this.prisma.city.update({ where: { id }, data: dto });

// delete
this.prisma.city.delete({ where: { id } });

// Transacciones (cuando sea necesario)
this.prisma.$transaction([
  this.prisma.otp.create({ data: { phone, code, expiresAt } }),
  // ... más operaciones
]);
```

---

## 14. NestJS

### Decoradores Esenciales

| Decorador | Uso |
|-----------|-----|
| `@Module()` | Define un módulo |
| `@Injectable()` | Marca una clase como provider |
| `@Controller('path')` | Define un controlador |
| `@Get()`, `@Post()`, `@Patch()`, `@Delete()` | Métodos HTTP |
| `@Body()` | Extrae cuerpo de la petición |
| `@Param('id')` | Extrae parámetro de ruta |
| `@Query()` | Extrae query params |
| `@UseGuards()` | Aplica guard (futuro) |
| `@Global()` | Hace un módulo global |
| `@Catch()` | Define un filter de excepciones |

### Global Modules

```typescript
// PrismaModule — @Global(), disponible sin importar
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// ConfigModule — isGlobal: true, disponible sin importar
ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })
```

### Feature Module Template

```typescript
@Module({
  controllers: [CitiesController],     // Solo controladores del módulo
  providers: [CitiesService],          // Solo servicios del módulo
})
export class CitiesModule {}
```

### Exception Hierarchy

```
HttpException (NestJS built-in)
├── BadRequestException      (400) — validación, input inválido
├── NotFoundException        (404) — entidad no encontrada
├── ConflictException        (409) — violación de unicidad
├── UnauthorizedException    (401) — futuro (auth)
├── ForbiddenException       (403) — futuro (roles)
└── (cualquier otra)         (500) — capturado por AllExceptionsFilter
```

### Global Pipes and Filters

```typescript
// En main.ts — se aplican a TODA la aplicación
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Elimina propiedades no decoradas
    forbidNonWhitelisted: true,   // Rechaza propiedades no decoradas (400)
    transform: true,              // Transforma tipos (string "1" → number 1)
  }),
);

app.useGlobalFilters(new AllExceptionsFilter());
```

---

## 15. React Native (para cuando se desarrolle el frontend mobile)

### Stack

- **Framework**: Expo SDK 52
- **Lenguaje**: TypeScript
- **Estilos**: NativeWind (Tailwind CSS para React Native)

### Reglas para React Native

1. **Usa NativeWind** para todos los estilos — no uses StyleSheet.create().
2. **Usa React Navigation** para la navegación.
3. **Organización**: `screens/`, `components/`, `services/`, `hooks/`, `utils/`, `constants/`.

### NativeWind

```tsx
// ✅ Correcto — NativeWind classes
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-800">Hello World</Text>
</View>

// ❌ Incorrecto — StyleSheet.create (no usar)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
});
```

---

## 16. Expo

### Comandos Clave

```bash
cd frontend-mobile
npx expo start          # Iniciar servidor de desarrollo
npx expo build:android  # Build para Android
npx expo build:ios      # Build para iOS
npx eas build           # EAS Build (recomendado)
```

### Reglas Expo

1. No uses módulos nativos que requieran `expo eject`.
2. Prefiere paquetes del ecosistema Expo (`expo-*`).
3. Usa `expo-router` si se necesita enrutamiento basado en archivos.

---

## 17. NativeWind

### Configuración Esperada

NativeWind convierte clases Tailwind en estilos React Native.

```tsx
// Sintaxis
<View className="flex-1 justify-center items-center bg-blue-500">
  <Text className="text-white text-xl font-bold">Loading...</Text>
</View>
```

### Equivalencias Importantes

| Tailwind | React Native (no usar) |
|----------|----------------------|
| `flex-1` | `flex: 1` |
| `p-4` | `padding: 16` |
| `mx-2` | `marginHorizontal: 8` |
| `text-lg` | `fontSize: 18` |
| `font-bold` | `fontWeight: 'bold'` |
| `bg-blue-500` | `backgroundColor: '#3B82F6'` |

### Reglas NativeWind

1. **Usa clases de Tailwind** exclusivamente — no mezcles con StyleSheet.
2. **Usa colores de Tailwind** — no valores RGB/hex personalizados (a menos que sea necesario).
3. **Usa `className`** no `style`.
4. Para estilos dinámicos/condicionales, usa template literals:
   ```tsx
   <View className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`} />
   ```

---

## 18. Reglas de Compatibilidad y No Regresión

### 18.1 Nunca Eliminar Código

```typescript
// ❌ NUNCA hagas esto:
// Eliminar un método existente
// async findOne(id: string) { ... }   // BORRADO ❌

// ✅ En su lugar, marca como deprecated o agrega uno nuevo:
/** @deprecated Usar findOneById en su lugar */
async findOne(id: string) {
  return this.findOneById(id);
}

async findOneById(id: string) {
  // Nueva implementación
}
```

### 18.2 Nunca Romper Compatibilidad

```typescript
// ❌ NUNCA cambies la firma de un método público:
// Antes:
async findAll(query?: QueryCityDto): Promise<City[]>
// Después (ROMPE compatibilidad):
async findAll(query?: QueryCityDto, page?: number): Promise<{ data: City[]; total: number }>

// ✅ Siempre agrega nuevos métodos en lugar de modificar los existentes:
async findAllPaginated(query?: QueryCityDto, page?: number): Promise<{ data: City[]; total: number }>
```

### 18.3 Nunca Modificar Archivos Fuera del Alcance

- Si la tarea es "implementar módulo X", **solo** toques archivos dentro de `src/x/`.
- Las únicas excepciones: `app.module.ts` (para registrar el nuevo módulo) y `schema.prisma` (si necesitas nuevos modelos).
- No modifiques `main.ts`, `common/`, `prisma/`, frontends, etc.

### 18.4 Verificación de No Regresión

Antes de finalizar cualquier tarea:

```
1. npm run build    → Debe compilar sin errores
2. npm test         → Deben pasar TODOS los tests (no solo los nuevos)
3. Revisar git diff → Solo archivos del alcance solicitado
```

---

## 19. Resumen de Comandos

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compilar TypeScript |
| `npm run start` | Iniciar servidor |
| `npm run start:dev` | Iniciar con watch |
| `npm run start:prod` | Iniciar en producción |
| `npm test` | Ejecutar todos los tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:cov` | Tests con cobertura |
| `npm run prisma:generate` | Regenerar Prisma Client |
| `npm run prisma:migrate` | Ejecutar migraciones |

### General

| Acción | Comando |
|--------|---------|
| Ver estructura de módulos | `ls backend/src/` |
| Ver estado git | `git status` |
| Ver cambios sin commit | `git diff` |

---

## 20. Checklist para Nuevos Módulos

Cuando implementes un nuevo módulo feature, sigue esta checklist:

- [ ] **DTOs** — `create-*.dto.ts`, `update-*.dto.ts`, `query-*.dto.ts`
  - [ ] Validación con class-validator en todas las propiedades
  - [ ] Swagger (`@ApiProperty` / `@ApiPropertyOptional`) en todas las propiedades
  - [ ] `UpdateDto` extiende `PartialType(CreateDto)` de `@nestjs/swagger`
- [ ] **Service** — `*.service.ts`
  - [ ] `@Injectable()` con `constructor(private readonly prisma: PrismaService)`
  - [ ] Métodos: `create`, `findAll`, `findOne`, `update`, `remove`
  - [ ] `findOne` lanza `NotFoundException` si no existe
  - [ ] Uniqueness validation con `ConflictException`
  - [ ] `include` en relaciones relevantes
  - [ ] `orderBy` apropiado
- [ ] **Controller** — `*.controller.ts`
  - [ ] `@ApiTags('NombreModulo')`
  - [ ] `@Controller('nombre-modulo')`
  - [ ] 5 endpoints: `POST`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`
  - [ ] Swagger decorators en cada endpoint
  - [ ] Sin lógica de negocio — solo delegación al servicio
- [ ] **Module** — `*.module.ts`
  - [ ] `@Module({ controllers: [...], providers: [...] })`
- [ ] **Tests** — `*.service.spec.ts`, `*.controller.spec.ts`
  - [ ] Mock completo de PrismaService (service tests)
  - [ ] Mock completo del servicio (controller tests)
  - [ ] `jest.clearAllMocks()` en `beforeEach`
  - [ ] Test de definición
  - [ ] Happy path para cada método
  - [ ] Error path para cada método (NotFoundException, ConflictException)
  - [ ] Test de filtros/búsqueda (findAll)
- [ ] **Registro** — Agregar en `app.module.ts`
- [ ] **Verificación** — `npm run build` + `npm test`

---

*Este documento es el System Prompt oficial del proyecto Cleaning App.
Cualquier ambigüedad en las instrucciones debe resolverse siguiendo las reglas aquí establecidas.
Versión: 1.0 — Julio 2026.*
