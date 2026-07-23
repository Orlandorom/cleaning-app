import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { PrismaService } from '../prisma/prisma.service';

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
    it('should create a city', async () => {
      const dto = { name: 'Bogotá' };
      mockPrisma.city.findUnique.mockResolvedValue(null);
      mockPrisma.city.create.mockResolvedValue({ id: '1', ...dto, createdAt: new Date() });

      const result = await service.create(dto);

      expect(mockPrisma.city.findUnique).toHaveBeenCalledWith({ where: { name: 'Bogotá' } });
      expect(mockPrisma.city.create).toHaveBeenCalledWith({ data: dto });
      expect(result.name).toBe('Bogotá');
    });

    it('should throw ConflictException if city already exists', async () => {
      const dto = { name: 'Bogotá' };
      mockPrisma.city.findUnique.mockResolvedValue({ id: '1', name: 'Bogotá' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrisma.city.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all cities ordered by name', async () => {
      const cities = [
        { id: '1', name: 'Bogotá', createdAt: new Date() },
        { id: '2', name: 'Medellín', createdAt: new Date() },
      ];
      mockPrisma.city.findMany.mockResolvedValue(cities);

      const result = await service.findAll();

      expect(mockPrisma.city.findMany).toHaveBeenCalledWith({ where: {}, orderBy: { name: 'asc' } });
      expect(result).toEqual(cities);
    });

    it('should search cities by name', async () => {
      mockPrisma.city.findMany.mockResolvedValue([]);
      await service.findAll({ search: 'Bog' });

      expect(mockPrisma.city.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Bog', mode: 'insensitive' } },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a city by id', async () => {
      const city = { id: '1', name: 'Bogotá', createdAt: new Date() };
      mockPrisma.city.findUnique.mockResolvedValue(city);

      const result = await service.findOne('1');

      expect(mockPrisma.city.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(city);
    });

    it('should throw NotFoundException if city not found', async () => {
      mockPrisma.city.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a city name', async () => {
      const existing = { id: '1', name: 'Bogotá', createdAt: new Date() };
      const dto = { name: 'Bogotá D.C.' };
      mockPrisma.city.findUnique.mockResolvedValueOnce(existing);
      mockPrisma.city.findUnique.mockResolvedValueOnce(null);
      mockPrisma.city.update.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('1', dto);

      expect(mockPrisma.city.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
      expect(result.name).toBe('Bogotá D.C.');
    });

    it('should throw ConflictException if new name already taken', async () => {
      mockPrisma.city.findUnique.mockResolvedValueOnce({ id: '1', name: 'Bogotá' });
      mockPrisma.city.findUnique.mockResolvedValueOnce({ id: '2', name: 'Medellín' });

      await expect(service.update('1', { name: 'Medellín' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if city not found', async () => {
      mockPrisma.city.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a city', async () => {
      const city = { id: '1', name: 'Bogotá', createdAt: new Date() };
      mockPrisma.city.findUnique.mockResolvedValue(city);
      mockPrisma.city.delete.mockResolvedValue(city);

      const result = await service.remove('1');

      expect(mockPrisma.city.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(city);
    });

    it('should throw NotFoundException if city not found', async () => {
      mockPrisma.city.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
