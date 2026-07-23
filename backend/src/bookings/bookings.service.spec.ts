import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  const mockPrisma = {
    client: { findUnique: jest.fn() },
    provider: { findUnique: jest.fn() },
    service: { findUnique: jest.fn() },
    booking: {
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
        BookingsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      clientId: 'client-1',
      providerId: 'provider-1',
      serviceId: 'service-1',
      scheduledAt: '2026-08-01T14:00:00Z',
      address: 'Calle 123 #45-67',
      totalPrice: 150000,
    };

    it('should create a booking', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'client-1' });
      mockPrisma.provider.findUnique.mockResolvedValue({ id: 'provider-1' });
      mockPrisma.service.findUnique.mockResolvedValue({ id: 'service-1' });
      mockPrisma.booking.create.mockResolvedValue({
        id: 'booking-1',
        clientId: 'client-1',
        providerId: 'provider-1',
        serviceId: 'service-1',
        scheduledAt: new Date('2026-08-01T14:00:00Z'),
        address: 'Calle 123 #45-67',
        notes: null,
        totalPrice: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(dto);

      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 'client-1' } });
      expect(mockPrisma.provider.findUnique).toHaveBeenCalledWith({ where: { id: 'provider-1' } });
      expect(mockPrisma.booking.create).toHaveBeenCalled();
      expect(result.id).toBe('booking-1');
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if provider not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'client-1' });
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if service not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'client-1' });
      mockPrisma.provider.findUnique.mockResolvedValue({ id: 'provider-1' });
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all bookings ordered by scheduledAt desc', async () => {
      const bookings = [{ id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() }];
      mockPrisma.booking.findMany.mockResolvedValue(bookings);

      const result = await service.findAll();

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { scheduledAt: 'desc' },
        include: { client: true, provider: true, service: true },
      });
      expect(result).toEqual(bookings);
    });

    it('should filter by clientId', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([]);
      await service.findAll({ clientId: 'c1' });

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: { clientId: 'c1' },
        orderBy: { scheduledAt: 'desc' },
        include: { client: true, provider: true, service: true },
      });
    });

    it('should filter by providerId', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([]);
      await service.findAll({ providerId: 'p1' });

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: { providerId: 'p1' },
        orderBy: { scheduledAt: 'desc' },
        include: { client: true, provider: true, service: true },
      });
    });

    it('should filter by status', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([]);
      await service.findAll({ status: 'PENDING' });

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        orderBy: { scheduledAt: 'desc' },
        include: { client: true, provider: true, service: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const booking = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne('1');

      expect(mockPrisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { client: true, provider: true, service: true },
      });
      expect(result).toEqual(booking);
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update booking status', async () => {
      const existing = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.booking.findUnique.mockResolvedValue(existing);
      mockPrisma.booking.update.mockResolvedValue({ ...existing, status: 'CONFIRMED' });

      const result = await service.update('1', { status: 'CONFIRMED' });

      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'CONFIRMED' },
        include: { client: true, provider: true, service: true },
      });
      expect(result.status).toBe('CONFIRMED');
    });

    it('should update booking address and notes', async () => {
      const existing = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'old', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.booking.findUnique.mockResolvedValue(existing);
      mockPrisma.booking.update.mockResolvedValue({ ...existing, address: 'new addr', notes: 'some notes' });

      await service.update('1', { address: 'new addr', notes: 'some notes' });

      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { address: 'new addr', notes: 'some notes' },
        include: { client: true, provider: true, service: true },
      });
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { status: 'CONFIRMED' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      const booking = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.booking.findUnique.mockResolvedValue(booking);
      mockPrisma.booking.delete.mockResolvedValue(booking);

      const result = await service.remove('1');

      expect(mockPrisma.booking.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(booking);
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
