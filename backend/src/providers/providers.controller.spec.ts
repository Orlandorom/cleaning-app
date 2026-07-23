import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

describe('ProvidersController', () => {
  let controller: ProvidersController;
  let service: ProvidersService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [{ provide: ProvidersService, useValue: mockService }],
    }).compile();

    controller = module.get<ProvidersController>(ProvidersController);
    service = module.get<ProvidersService>(ProvidersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the dto', async () => {
      const dto: CreateProviderDto = { name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1' };
      const expected = { id: '1', ...dto, createdAt: new Date(), updatedAt: new Date() };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll without query', async () => {
      const expected = [{ id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() }];
      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expected);
    });

    it('should call service.findAll with query', async () => {
      const query = { search: 'Juan' };
      mockService.findAll.mockResolvedValue([]);

      await controller.findAll(query);

      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the id', async () => {
      const expected = { id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() };
      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateProviderDto = { name: 'Juan Carlos Pérez' };
      const expected = { id: '1', name: 'Juan Carlos Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() };
      mockService.update.mockResolvedValue(expected);

      const result = await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the id', async () => {
      const expected = { id: '1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1', createdAt: new Date(), updatedAt: new Date() };
      mockService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });
});
