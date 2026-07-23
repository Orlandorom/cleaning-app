import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly otpService: OtpService) {}

  @Post('otp/send')
  @ApiOperation({ summary: 'Enviar código OTP al teléfono' })
  @ApiResponse({ status: 201, description: 'OTP enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Número de teléfono inválido' })
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.otpService.sendOtp(dto.phone);
    return { message: 'Código enviado exitosamente' };
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verificar código OTP' })
  @ApiResponse({ status: 201, description: 'Código verificado exitosamente' })
  @ApiResponse({ status: 400, description: 'Código incorrecto, expirado o demasiados intentos' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.otpService.verifyOtp(dto.phone, dto.code);
    return { message: 'Código verificado exitosamente' };
  }
}
