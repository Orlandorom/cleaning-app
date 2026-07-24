import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterRole } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const dto: RegisterDto = {
        phone: '+573001234567',
        code: '123456',
        name: 'Juan Pérez',
        role: RegisterRole.CLIENT,
        email: 'juan@email.com',
      };
      const expectedResult = {
        message: 'Registro exitoso',
        user: { id: 'user-1', phone: '+573001234567', role: 'CLIENT' },
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: new Date(),
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const dto: LoginDto = { phone: '+573001234567', code: '123456' };
      const expectedResult = {
        message: 'Inicio de sesión exitoso',
        user: { id: 'user-1', phone: '+573001234567', role: 'CLIENT' },
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: new Date(),
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh and return result', async () => {
      const dto: RefreshDto = { refreshToken: 'some-refresh-token' };
      const expectedResult = {
        message: 'Sesión renovada exitosamente',
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        expiresAt: new Date(),
      };
      mockAuthService.refresh.mockResolvedValue(expectedResult);

      const result = await controller.refresh(dto);

      expect(mockAuthService.refresh).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with userId and return result', async () => {
      const expectedResult = { message: 'Sesión cerrada exitosamente' };
      mockAuthService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout('user-1');

      expect(mockAuthService.logout).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with userId and return result', async () => {
      const expectedResult = {
        user: { id: 'user-1', phone: '+573001234567', role: 'CLIENT' },
        client: { id: 'client-1', name: 'Juan Pérez' },
        provider: null,
      };
      mockAuthService.getProfile.mockResolvedValue(expectedResult);

      const result = await controller.getProfile('user-1');

      expect(mockAuthService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(expectedResult);
    });
  });
});
