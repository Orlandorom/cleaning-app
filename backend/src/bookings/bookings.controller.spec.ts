import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the dto', async () => {
      const dto: CreateBookingDto = {
        clientId: 'client-1',
        providerId: 'provider-1',
        serviceId: 'service-1',
        scheduledAt: '2026-08-01T14:00:00Z',
        address: 'Calle 123 #45-67',
        totalPrice: 150000,
      };
      const expected = { id: '1', ...dto, notes: null, scheduledAt: new Date(dto.scheduledAt), createdAt: new Date(), updatedAt: new Date() };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll without query', async () => {
      const expected = [{ id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() }];
      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expected);
    });

    it('should call service.findAll with query', async () => {
      const query = { clientId: 'c1' };
      mockService.findAll.mockResolvedValue([]);

      await controller.findAll(query);

      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the id', async () => {
      const expected = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateBookingDto = { status: 'CONFIRMED' };
      const expected = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', status: 'CONFIRMED', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockService.update.mockResolvedValue(expected);

      const result = await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the id', async () => {
      const expected = { id: '1', clientId: 'c1', providerId: 'p1', serviceId: 's1', scheduledAt: new Date(), address: 'addr', totalPrice: 100, createdAt: new Date(), updatedAt: new Date() };
      mockService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });
});
