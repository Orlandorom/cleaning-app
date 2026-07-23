import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService;

  const mockPrisma = {
    client: {
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
        ClientsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { name: 'Carlos López', phone: '+573009876543' };

    it('should create a client', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);
      mockPrisma.client.create.mockResolvedValue({ id: '1', ...dto, email: null, createdAt: new Date(), updatedAt: new Date() });

      const result = await service.create(dto);

      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { phone: '+573009876543' } });
      expect(mockPrisma.client.create).toHaveBeenCalledWith({ data: dto });
      expect(result.name).toBe('Carlos López');
    });

    it('should throw ConflictException if phone already exists', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({ id: '1', phone: '+573009876543' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrisma.client.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all clients ordered by name', async () => {
      const clients = [
        { id: '1', name: 'Ana Martínez', phone: '+573001111111', email: null, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.client.findMany.mockResolvedValue(clients);

      const result = await service.findAll();

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith({ where: {}, orderBy: { name: 'asc' } });
      expect(result).toEqual(clients);
    });

    it('should search clients by name', async () => {
      mockPrisma.client.findMany.mockResolvedValue([]);
      await service.findAll({ search: 'Carlos' });

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Carlos', mode: 'insensitive' } },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const client = { id: '1', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.client.findUnique.mockResolvedValue(client);

      const result = await service.findOne('1');

      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(client);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a client name', async () => {
      const existing = { id: '1', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() };
      const dto = { name: 'Carlos Andrés López' };
      mockPrisma.client.findUnique.mockResolvedValueOnce(existing);
      mockPrisma.client.update.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('1', dto);

      expect(mockPrisma.client.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
      expect(result.name).toBe('Carlos Andrés López');
    });

    it('should throw ConflictException if new phone already taken', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({ id: '1', phone: '+573009876543' });
      mockPrisma.client.findUnique.mockResolvedValueOnce({ id: '2', phone: '+573001111111' });

      await expect(service.update('1', { phone: '+573001111111' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      const client = { id: '1', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.client.findUnique.mockResolvedValue(client);
      mockPrisma.client.delete.mockResolvedValue(client);

      const result = await service.remove('1');

      expect(mockPrisma.client.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(client);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
