import { Injectable, Logger, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private twilioClient: any = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.initTwilio();
  }

  private initTwilio() {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    if (accountSid && authToken) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(accountSid, authToken);
      } catch {
        this.logger.warn('No se pudo inicializar Twilio');
      }
    }
  }

  private async sendSms(to: string, body: string) {
    if (this.twilioClient) {
      const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
      await this.twilioClient.messages.create({ to, from, body });
    } else {
      this.logger.log(`[SMS simulacro] Para: ${to} | Mensaje: ${body}`);
    }
  }

  async sendOtp(phone: string) {
    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.otp.create({ data: { phone, code, expiresAt } });

    const message = `Tu código de verificación es: ${code}. Válido por ${OTP_EXPIRY_MINUTES} minutos.`;
    await this.sendSms(phone, message);

    this.logger.log(`OTP enviado a ${phone}`);
  }

  async verifyOtp(phone: string, code: string) {
    const latest = await this.prisma.otp.findFirst({
      where: { phone, verified: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      throw new BadRequestException('No hay un código OTP vigente. Solicite uno nuevo.');
    }

    if (latest.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException('Demasiados intentos fallidos. Solicite un nuevo código.');
    }

    if (latest.code !== code) {
      await this.prisma.otp.update({
        where: { id: latest.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Código incorrecto.');
    }

    await this.prisma.otp.update({
      where: { id: latest.id },
      data: { verified: true },
    });

    this.logger.log(`OTP verificado para ${phone}`);
  }
}
