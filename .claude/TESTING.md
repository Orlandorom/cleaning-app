# Testing Guidelines — Cleaning App

## Test Runner

- **Framework**: Jest v30 with `ts-jest` v29
- **Config**: `backend/jest.config.js`

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

## Running Tests

```bash
cd backend
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:cov    # With coverage report
```

## Test Structure

### File Naming

Test files sit next to the source files they test:

```
src/cities/
├── cities.service.ts
├── cities.service.spec.ts       # Tests for service
├── cities.controller.ts
├── cities.controller.spec.ts    # Tests for controller
```

### Test Suite Pattern

Each test file follows this structure:

```typescript
describe('CitiesService', () => {
  let service: CitiesService;
  let prisma: PrismaService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // ...
  });
});
```

## Service Tests

### Mocking Strategy

- Mock the **entire** `PrismaService` — never connect to a database.
- Create a plain object with jest.fn() for each model method used.
- Provide the mock via `{ provide: PrismaService, useValue: mockPrisma }`.

### What to Test

For each method, test:

1. **Happy path** — the method works correctly with valid input
2. **Not found** — throws `NotFoundException` when entity missing
3. **Conflict** — throws `ConflictException` on uniqueness violation
4. **Filters** — query parameters are passed correctly to Prisma
5. **Relations** — `include` is used where expected

### Example Assertions

```typescript
// Service called Prisma correctly
expect(mockPrisma.city.findUnique).toHaveBeenCalledWith({ where: { name: 'Bogotá' } });
expect(mockPrisma.city.create).toHaveBeenCalledWith({ data: dto });

// Error case
await expect(service.findOne('999')).rejects.toThrow(NotFoundException);

// Result matches expectations
expect(result.name).toBe('Bogotá');
```

## Controller Tests

### Mocking Strategy

- Mock the **entire service** with a plain object of jest.fn().
- Provide via `{ provide: CitiesService, useValue: mockService }`.

### What to Test

1. **Delegation** — controller calls the correct service method with correct args
2. **Return value** — controller returns what the service returns

### Example

```typescript
mockService.create.mockResolvedValue(expected);

const result = await controller.create(dto);

expect(mockService.create).toHaveBeenCalledWith(dto);
expect(result).toEqual(expected);
```

## Coverage Targets

- **Current**: 111 tests, all passing.
- **Target for new modules**: 100% of service methods covered (success + error cases), 100% of controller endpoints covered.
- **Future**: Minimum 80% overall code coverage (enforced via CI).

## What NOT to Test

- Prisma Client internals (those are tested by Prisma team).
- ValidationPipe behavior (tested by NestJS team).
- Global exception filter behavior (integration test, future).
- Pure TypeScript types/interfaces.

## Mocking Prisma Enums

When a DTO uses a Prisma enum type (e.g., `ServiceType`, `BookingStatus`), tests must import and use the enum:

```typescript
import { ServiceType } from '@prisma/client';

// In test data:
const dto = { name: 'Limpieza', type: ServiceType.GENERAL, duration: 120 };
```

## Integration / E2E Tests

Not yet implemented. When added (future phases), they should:

- Use a test database (Neon branch or local PostgreSQL).
- Cover critical user flows: registration → login → create booking → complete cycle.
- Use `@nestjs/testing` `SuperTest` for HTTP assertions.
