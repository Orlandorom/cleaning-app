import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [{ provide: ServicesService, useValue: mockService }],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the dto', async () => {
      const dto: CreateServiceDto = { name: 'Limpieza general', type: 'GENERAL', duration: 120 };
      const expected = { id: '1', ...dto, description: null, createdAt: new Date() };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll without query', async () => {
      const expected = [{ id: '1', name: 'Limpieza general', type: 'GENERAL', duration: 120, description: null, createdAt: new Date() }];
      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expected);
    });

    it('should call service.findAll with query', async () => {
      const query = { search: 'Limpieza' };
      mockService.findAll.mockResolvedValue([]);

      await controller.findAll(query);

      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the id', async () => {
      const expected = { id: '1', name: 'Limpieza general', type: 'GENERAL', duration: 120, description: null, createdAt: new Date() };
      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateServiceDto = { name: 'Limpieza completa' };
      const expected = { id: '1', name: 'Limpieza completa', type: 'GENERAL', duration: 120, description: null, createdAt: new Date() };
      mockService.update.mockResolvedValue(expected);

      const result = await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the id', async () => {
      const expected = { id: '1', name: 'Limpieza general', type: 'GENERAL', duration: 120, description: null, createdAt: new Date() };
      mockService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });
});
