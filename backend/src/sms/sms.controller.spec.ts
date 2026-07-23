import { Test, TestingModule } from '@nestjs/testing';
import { SmsController } from './sms.controller';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

describe('SmsController', () => {
  let controller: SmsController;
  let service: OtpService;

  const mockOtpService = {
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsController],
      providers: [{ provide: OtpService, useValue: mockOtpService }],
    }).compile();

    controller = module.get<SmsController>(SmsController);
    service = module.get<OtpService>(OtpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should call otpService.sendOtp and return success message', async () => {
      const dto: SendOtpDto = { phone: '+573001234567' };
      mockOtpService.sendOtp.mockResolvedValue(undefined);

      const result = await controller.sendOtp(dto);

      expect(mockOtpService.sendOtp).toHaveBeenCalledWith('+573001234567');
      expect(result).toEqual({ message: 'Código enviado exitosamente' });
    });
  });

  describe('verifyOtp', () => {
    it('should call otpService.verifyOtp and return success message', async () => {
      const dto: VerifyOtpDto = { phone: '+573001234567', code: '123456' };
      mockOtpService.verifyOtp.mockResolvedValue(undefined);

      const result = await controller.verifyOtp(dto);

      expect(mockOtpService.verifyOtp).toHaveBeenCalledWith('+573001234567', '123456');
      expect(result).toEqual({ message: 'Código verificado exitosamente' });
    });
  });
});
