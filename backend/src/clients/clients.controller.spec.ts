import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [{ provide: ClientsService, useValue: mockService }],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the dto', async () => {
      const dto: CreateClientDto = { name: 'Carlos López', phone: '+573009876543' };
      const expected = { id: '1', ...dto, email: null, createdAt: new Date(), updatedAt: new Date() };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll without query', async () => {
      const expected = [{ id: '1', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() }];
      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expected);
    });

    it('should call service.findAll with query', async () => {
      const query = { search: 'Carlos' };
      mockService.findAll.mockResolvedValue([]);

      await controller.findAll(query);

      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the id', async () => {
      const expected = { id: '1', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() };
      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateClientDto = { name: 'Carlos Andrés López' };
      const expected = { id: '1', name: 'Carlos Andrés López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() };
      mockService.update.mockResolvedValue(expected);

      const result = await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the id', async () => {
      const expected = { id: '1', name: 'Carlos López', phone: '+573009876543', email: null, createdAt: new Date(), updatedAt: new Date() };
      mockService.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(expected);
    });
  });
});
