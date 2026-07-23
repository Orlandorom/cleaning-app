# Coding Standards — Cleaning App

## General Principles

1. **Readability over cleverness.** Write code that is easy to understand.
2. **Consistency over personal preference.** Follow existing patterns exactly.
3. **Thin controllers, fat services.** Controllers handle HTTP concerns only.
4. **No code without tests.** Every feature module must have passing unit tests.
5. **No unused imports or variables.** TypeScript strict mode is enabled.
6. **Spanish for user-facing strings.** English for identifiers, comments, and docs.

## TypeScript & NestJS

### File Naming

| File Type | Convention | Example |
|-----------|-----------|---------|
| Module | `kebab-case.module.ts` | `cities.module.ts` |
| Controller | `kebab-case.controller.ts` | `cities.controller.ts` |
| Service | `kebab-case.service.ts` | `cities.service.ts` |
| DTO | `kebab-case.dto.ts` | `create-city.dto.ts` |
| Test | `kebab-case.spec.ts` | `cities.service.spec.ts` |
| Directory | `kebab-case/` | `cities/` |

### Module Structure

```
module-name/
├── dto/
│   ├── create-entity.dto.ts
│   ├── update-entity.dto.ts      # extends PartialType(CreateEntityDto)
│   └── query-entity.dto.ts       # optional filters
├── module-name.service.ts
├── module-name.controller.ts
├── module-name.module.ts
├── module-name.service.spec.ts
└── module-name.controller.spec.ts
```

### Imports Order

1. External packages (`@nestjs/*`, `@prisma/client`, `class-validator`, etc.)
2. Internal modules (`../prisma/prisma.service`)
3. Local DTOs (`./dto/create-*.dto`)
4. (Blank line between groups)

### Classes & Decorators

```typescript
@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCityDto) { ... }
}
```

- Use `private readonly` for injected dependencies.
- Use `@Injectable()` on every service.
- Use `@Controller('plural')` with `@ApiTags('Plural')`.

### DTOs

- Every DTO property gets both a `class-validator` decorator AND a Swagger decorator.
- Use `@ApiProperty` for required fields, `@ApiPropertyOptional` for optional.
- Validation order: type check → presence → format/length.
- Use `@IsOptional()` as the first decorator on optional fields.

```typescript
export class CreateCityDto {
  @ApiProperty({ example: 'Bogotá', description: 'Nombre de la ciudad', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
```

- `UpdateDto` always extends `PartialType(CreateDto)` from `@nestjs/swagger`.
- `QueryDto` contains only optional filter fields.

## Service Layer

- All methods are `async`.
- Name uniqueness is validated BEFORE creation/update — throw `ConflictException`.
- Entity existence is validated before access — throw `NotFoundException`.
- Use `include` for relations, not raw joins.
- Use `findUnique` for single-record lookups by unique field.
- Use `findMany` with `where`, `orderBy`, and `include` for lists.

```typescript
async findOne(id: string) {
  const entity = await this.prisma.entity.findUnique({ where: { id }, include: { related: true } });
  if (!entity) throw new NotFoundException(`Entity con id "${id}" no encontrado`);
  return entity;
}
```

## Controller Layer

- Five standard endpoints: `POST`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
- Each endpoint has `@ApiOperation`, `@ApiResponse`, and `@ApiParam` (where applicable).
- Controllers do NOT contain business logic — delegate to service.
- Use `@Query()` for filter DTOs, `@Body()` for create/update, `@Param()` for IDs.

## Error Handling

| Exception | HTTP Status | When |
|-----------|-------------|------|
| `BadRequestException` | 400 | Validation failure, invalid input |
| `NotFoundException` | 404 | Entity not found by ID |
| `ConflictException` | 409 | Unique constraint violation |
| `AllExceptionsFilter` | 500 | Unhandled errors (logged) |

- Custom error messages in Spanish: `Cliente con id "${id}" no encontrado`
- The global `AllExceptionsFilter` catches everything that isn't an `HttpException`.

## Testing

- Mock `PrismaService` entirely — never connect to a real database.
- Use `@nestjs/testing` `Test.createTestingModule`.
- Call `jest.clearAllMocks()` in `beforeEach`.
- Service tests: mock each Prisma model method (`findUnique`, `create`, `findMany`, `update`, `delete`).
- Controller tests: mock the entire service with a plain object.
- Test both success and error paths for every operation.
