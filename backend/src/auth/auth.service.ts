import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Twilio } from 'twilio';

const otpStore = new Map<string, { code: string; expiresAt: Date }>();
const rateLimitMap = new Map<string, { count: number; resetAt: Date }>();

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private twilioClient: Twilio | undefined;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    }
  }

  async sendOtp(phone: string): Promise<void> {
    const now = new Date();
    const entry = rateLimitMap.get(phone);

    if (entry && now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT_MAX) {
        throw new HttpException('Demasiados intentos. Intenta en 15 minutos.', HttpStatus.TOO_MANY_REQUESTS);
      }
      entry.count++;
    } else {
      rateLimitMap.set(phone, { count: 1, resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS) });
    }

    const code = randomInt(100_000, 1_000_000).toString();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MS);
    otpStore.set(phone, { code, expiresAt });

    if (this.twilioClient) {
      await this.twilioClient.messages.create({
        body: `Tu código de verificación es: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } else {
      this.logger.warn(`Twilio no configurado. Código OTP para ${phone}: ${code}`);
    }
  }

  async verifyOtp(phone: string, code: string): Promise<{ token: string; client: { id: string; name?: string; phone: string } }> {
    const stored = otpStore.get(phone);

    if (!stored) throw new BadRequestException('No se ha solicitado un código');
    if (new Date() > stored.expiresAt) {
      otpStore.delete(phone);
      throw new BadRequestException('El código ha expirado');
    }
    if (stored.code !== code) throw new UnauthorizedException('Código incorrecto');

    otpStore.delete(phone);

    let client = await this.prisma.client.findUnique({ where: { phone } });

    if (!client) {
      client = await this.prisma.client.create({ data: { phone, name: '' } });
    }

    const token = this.jwtService.sign({ sub: client.id, phone: client.phone });

    return { token, client: { id: client.id, name: client.name, phone: client.phone } };
  }

  async register(data: { name: string; phone: string; email?: string }): Promise<{ token: string; client: { id: string; name: string; phone: string; email?: string } }> {
    const existing = await this.prisma.client.findUnique({ where: { phone: data.phone } });
    if (existing) throw new BadRequestException('El teléfono ya está registrado');

    const client = await this.prisma.client.create({ data });

    const token = this.jwtService.sign({ sub: client.id, phone: client.phone });

    return { token, client: { id: client.id, name: client.name, phone: client.phone, email: client.email ?? undefined } };
  }
}
