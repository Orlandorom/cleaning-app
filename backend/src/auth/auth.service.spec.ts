import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterRole } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    otp: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    client: {
      create: jest.fn(),
    },
    provider: {
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      return null;
    });
    mockJwtService.sign.mockReturnValue('test-access-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const validDto = {
      phone: '+573001234567',
      code: '123456',
      name: 'Juan Pérez',
      role: RegisterRole.CLIENT,
      email: 'juan@email.com',
    };

    it('should register a new CLIENT user successfully', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: 'otp-1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({ verified: true });
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        return fn(mockPrisma);
      });
      mockPrisma.client.create.mockResolvedValue({ id: 'client-1', name: 'Juan Pérez', phone: '+573001234567', email: 'juan@email.com' });
      mockPrisma.user.create.mockResolvedValue({ id: 'user-1', phone: '+573001234567', role: 'CLIENT', clientId: 'client-1', providerId: null });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1', token: 'refresh-uuid', userId: 'user-1', role: 'CLIENT', expiresAt: new Date(), revoked: false, createdAt: new Date() });

      const result = await service.register(validDto);

      expect(result.message).toBe('Registro exitoso');
      expect(result.user.role).toBe('CLIENT');
      expect(result.accessToken).toBe('test-access-token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw if phone already registered', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: 'otp-1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({ verified: true });
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-user', phone: '+573001234567', role: 'CLIENT' });

      await expect(service.register(validDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if OTP is invalid', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue(null);

      await expect(service.register(validDto)).rejects.toThrow(BadRequestException);
    });

    it('should register a PROVIDER user with cityId', async () => {
      const providerDto = { ...validDto, role: RegisterRole.PROVIDER, cityId: 'city-1', description: 'Experto en limpieza' };

      mockPrisma.otp.findFirst.mockResolvedValue({
        id: 'otp-2',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({ verified: true });
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));
      mockPrisma.provider.create.mockResolvedValue({ id: 'provider-1', name: 'Juan Pérez', phone: '+573001234567', cityId: 'city-1' });
      mockPrisma.user.create.mockResolvedValue({ id: 'user-2', phone: '+573001234567', role: 'PROVIDER', providerId: 'provider-1', clientId: null });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2', token: 'refresh-uuid', userId: 'user-2', role: 'PROVIDER', expiresAt: new Date(), revoked: false, createdAt: new Date() });

      const result = await service.register(providerDto);

      expect(result.message).toBe('Registro exitoso');
      expect(result.user.role).toBe('PROVIDER');
    });

    it('should throw for PROVIDER without cityId', async () => {
      const providerDto = { ...validDto, role: RegisterRole.PROVIDER };
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: 'otp-1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({ verified: true });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.register(providerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid OTP', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: 'otp-1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({ verified: true });
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', phone: '+573001234567', role: 'CLIENT' });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1', token: 'refresh-uuid', userId: 'user-1', role: 'CLIENT', expiresAt: new Date(), revoked: false, createdAt: new Date() });

      const result = await service.login({ phone: '+573001234567', code: '123456' });

      expect(result.message).toBe('Inicio de sesión exitoso');
      expect(result.accessToken).toBe('test-access-token');
    });

    it('should throw if phone is not registered', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: 'otp-1',
        phone: '+573009999999',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({ verified: true });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ phone: '+573009999999', code: '123456' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        token: 'valid-refresh-token',
        userId: 'user-1',
        role: 'CLIENT',
        expiresAt: new Date(Date.now() + 86400000),
        revoked: false,
        createdAt: new Date(),
      });
      mockPrisma.refreshToken.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2', token: 'new-refresh-token', userId: 'user-1', role: 'CLIENT', expiresAt: new Date(), revoked: false, createdAt: new Date() });

      const result = await service.refresh({ refreshToken: 'valid-refresh-token' });

      expect(result.message).toBe('Sesión renovada exitosamente');
      expect(result.accessToken).toBe('test-access-token');
    });

    it('should throw if refresh token is revoked', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        token: 'revoked-token',
        userId: 'user-1',
        role: 'CLIENT',
        expiresAt: new Date(Date.now() + 86400000),
        revoked: true,
        createdAt: new Date(),
      });

      await expect(service.refresh({ refreshToken: 'revoked-token' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if refresh token is expired', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        token: 'expired-token',
        userId: 'user-1',
        role: 'CLIENT',
        expiresAt: new Date(Date.now() - 86400000),
        revoked: false,
        createdAt: new Date(),
      });

      await expect(service.refresh({ refreshToken: 'expired-token' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke all refresh tokens for the user', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.logout('user-1');

      expect(result.message).toBe('Sesión cerrada exitosamente');
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revoked: false },
        data: { revoked: true },
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile with client data', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        phone: '+573001234567',
        role: 'CLIENT',
        clientId: 'client-1',
        providerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: { id: 'client-1', name: 'Juan Pérez', phone: '+573001234567', email: 'juan@email.com', createdAt: new Date(), updatedAt: new Date() },
        provider: null,
      });

      const result = await service.getProfile('user-1');

      expect(result.user).toBeDefined();
      expect(result.client).toBeDefined();
      expect(result.provider).toBeNull();
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('non-existent')).rejects.toThrow(UnauthorizedException);
    });
  });
});
