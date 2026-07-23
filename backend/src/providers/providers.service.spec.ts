import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProvidersService', () => {
  let service: ProvidersService;
  let prisma: PrismaService;

  const mockPrisma = {
    provider: {
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
        ProvidersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1' };

    it('should create a provider', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);
      mockPrisma.provider.create.mockResolvedValue({ id: '1', ...dto, createdAt: new Date(), updatedAt: new Date() });

      const result = await service.create(dto);

      expect(mockPrisma.provider.findUnique).toHaveBeenCalledWith({ where: { phone: '+573001234567' } });
      expect(mockPrisma.provider.create).toHaveBeenCalledWith({ data: dto, include: { city: true } });
      expect(result.name).toBe('Juan Pérez');
    });

    it('should throw ConflictException if phone already exists', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue({ id: '1', phone: '+573001234567' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrisma.provider.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all providers ordered by name', async () => {
      const providers = [
        { id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'María Gómez', phone: '+573001234568', cityId: 'city-2', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.provider.findMany.mockResolvedValue(providers);

      const result = await service.findAll();

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith({ where: {}, orderBy: { name: 'asc' }, include: { city: true } });
      expect(result).toEqual(providers);
    });

    it('should search providers by name', async () => {
      mockPrisma.provider.findMany.mockResolvedValue([]);
      await service.findAll({ search: 'Juan' });

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Juan', mode: 'insensitive' } },
        orderBy: { name: 'asc' },
        include: { city: true },
      });
    });

    it('should filter by availability', async () => {
      mockPrisma.provider.findMany.mockResolvedValue([]);
      await service.findAll({ isAvailable: true });

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith({
        where: { isAvailable: true },
        orderBy: { name: 'asc' },
        include: { city: true },
      });
    });

    it('should filter by cityId', async () => {
      mockPrisma.provider.findMany.mockResolvedValue([]);
      await service.findAll({ cityId: 'city-1' });

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith({
        where: { cityId: 'city-1' },
        orderBy: { name: 'asc' },
        include: { city: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a provider by id', async () => {
      const provider = { id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.provider.findUnique.mockResolvedValue(provider);

      const result = await service.findOne('1');

      expect(mockPrisma.provider.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { city: true } });
      expect(result).toEqual(provider);
    });

    it('should throw NotFoundException if provider not found', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a provider name', async () => {
      const existing = { id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() };
      const dto = { name: 'Juan Carlos Pérez' };
      mockPrisma.provider.findUnique.mockResolvedValueOnce(existing);
      mockPrisma.provider.update.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('1', dto);

      expect(mockPrisma.provider.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto, include: { city: true } });
      expect(result.name).toBe('Juan Carlos Pérez');
    });

    it('should throw ConflictException if new phone already taken', async () => {
      mockPrisma.provider.findUnique.mockResolvedValueOnce({ id: '1', phone: '+573001234567' });
      mockPrisma.provider.findUnique.mockResolvedValueOnce({ id: '2', phone: '+573001234568' });

      await expect(service.update('1', { phone: '+573001234568' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if provider not found', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a provider', async () => {
      const provider = { id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.provider.findUnique.mockResolvedValue(provider);
      mockPrisma.provider.delete.mockResolvedValue(provider);

      const result = await service.remove('1');

      expect(mockPrisma.provider.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(provider);
    });

    it('should throw NotFoundException if provider not found', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
