import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OtpService', () => {
  let service: OtpService;
  let prisma: PrismaService;

  const mockPrisma = {
    otp: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'TWILIO_ACCOUNT_SID') return undefined;
      if (key === 'TWILIO_AUTH_TOKEN') return undefined;
      return null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should create an OTP record and send SMS', async () => {
      mockPrisma.otp.create.mockResolvedValue({ id: '1', phone: '+573001234567', code: '123456', expiresAt: new Date(), verified: false, attempts: 0, createdAt: new Date() });

      await service.sendOtp('+573001234567');

      expect(mockPrisma.otp.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '+573001234567',
          code: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
    });
  });

  describe('verifyOtp', () => {
    it('should verify a valid OTP', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: '1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({});

      await service.verifyOtp('+573001234567', '123456');

      expect(mockPrisma.otp.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { verified: true },
      });
    });

    it('should throw if no valid OTP found', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue(null);

      await expect(service.verifyOtp('+573001234567', '123456')).rejects.toThrow(BadRequestException);
    });

    it('should throw if max attempts reached', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: '1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 5,
        createdAt: new Date(),
      });

      await expect(service.verifyOtp('+573001234567', '999999')).rejects.toThrow(BadRequestException);
    });

    it('should throw if code is incorrect and increment attempts', async () => {
      mockPrisma.otp.findFirst.mockResolvedValue({
        id: '1',
        phone: '+573001234567',
        code: '123456',
        expiresAt: new Date(Date.now() + 600000),
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      });
      mockPrisma.otp.update.mockResolvedValue({});

      await expect(service.verifyOtp('+573001234567', '999999')).rejects.toThrow(BadRequestException);

      expect(mockPrisma.otp.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { attempts: { increment: 1 } },
      });
    });
  });
});
