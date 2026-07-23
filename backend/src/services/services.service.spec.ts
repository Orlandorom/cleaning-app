import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ServiceType } from '@prisma/client';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: PrismaService;

  const mockPrisma = {
    service: {
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
        ServicesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const dto = { name: 'Limpieza general', type: ServiceType.GENERAL, duration: 120 };
      mockPrisma.service.findUnique.mockResolvedValue(null);
      mockPrisma.service.create.mockResolvedValue({ id: '1', ...dto, description: null, createdAt: new Date() });

      const result = await service.create(dto);

      expect(mockPrisma.service.findUnique).toHaveBeenCalledWith({ where: { name: 'Limpieza general' } });
      expect(mockPrisma.service.create).toHaveBeenCalledWith({ data: dto });
      expect(result.name).toBe('Limpieza general');
    });

    it('should throw ConflictException if service already exists', async () => {
      const dto = { name: 'Limpieza general', type: ServiceType.GENERAL, duration: 120 };
      mockPrisma.service.findUnique.mockResolvedValue({ id: '1', name: 'Limpieza general' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrisma.service.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all services ordered by name', async () => {
      const services = [
        { id: '1', name: 'Limpieza general', type: ServiceType.GENERAL, duration: 120, description: null, createdAt: new Date() },
        { id: '2', name: 'Limpieza profunda', type: ServiceType.DEEP, duration: 180, description: null, createdAt: new Date() },
      ];
      mockPrisma.service.findMany.mockResolvedValue(services);

      const result = await service.findAll();

      expect(mockPrisma.service.findMany).toHaveBeenCalledWith({ where: {}, orderBy: { name: 'asc' } });
      expect(result).toEqual(services);
    });

    it('should search services by name', async () => {
      mockPrisma.service.findMany.mockResolvedValue([]);
      await service.findAll({ search: 'Limpieza' });

      expect(mockPrisma.service.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Limpieza', mode: 'insensitive' } },
        orderBy: { name: 'asc' },
      });
    });

    it('should filter services by type', async () => {
      mockPrisma.service.findMany.mockResolvedValue([]);
      await service.findAll({ type: ServiceType.DEEP });

      expect(mockPrisma.service.findMany).toHaveBeenCalledWith({
        where: { type: ServiceType.DEEP },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      const svc = { id: '1', name: 'Limpieza general', type: ServiceType.GENERAL, duration: 120, description: null, createdAt: new Date() };
      mockPrisma.service.findUnique.mockResolvedValue(svc);

      const result = await service.findOne('1');

      expect(mockPrisma.service.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(svc);
    });

    it('should throw NotFoundException if service not found', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a service name', async () => {
      const existing = { id: '1', name: 'Limpieza general', type: ServiceType.GENERAL, duration: 120, description: null, createdAt: new Date() };
      const dto = { name: 'Limpieza completa' };
      mockPrisma.service.findUnique.mockResolvedValueOnce(existing);
      mockPrisma.service.findUnique.mockResolvedValueOnce(null);
      mockPrisma.service.update.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('1', dto);

      expect(mockPrisma.service.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
      expect(result.name).toBe('Limpieza completa');
    });

    it('should throw ConflictException if new name already taken', async () => {
      mockPrisma.service.findUnique.mockResolvedValueOnce({ id: '1', name: 'Limpieza general' });
      mockPrisma.service.findUnique.mockResolvedValueOnce({ id: '2', name: 'Limpieza profunda' });

      await expect(service.update('1', { name: 'Limpieza profunda' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if service not found', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a service', async () => {
      const svc = { id: '1', name: 'Limpieza general', type: ServiceType.GENERAL, duration: 120, description: null, createdAt: new Date() };
      mockPrisma.service.findUnique.mockResolvedValue(svc);
      mockPrisma.service.delete.mockResolvedValue(svc);

      const result = await service.remove('1');

      expect(mockPrisma.service.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(svc);
    });

    it('should throw NotFoundException if service not found', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
