import { Injectable, Logger, BadRequestException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, RegisterRole } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { randomUUID } from 'crypto';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const ACCESS_TOKEN_EXPIRY = '60m';
const REFRESH_TOKEN_DAYS = 30;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async verifyOtp(phone: string, code: string) {
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
  }

  private async generateTokens(userId: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, role },
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        role,
        expiresAt,
      },
    });

    return { accessToken, refreshToken, expiresAt };
  }

  async register(dto: RegisterDto) {
    await this.verifyOtp(dto.phone, dto.code);

    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existingUser) {
      throw new BadRequestException('El teléfono ya está registrado');
    }

    if (dto.role === RegisterRole.PROVIDER && !dto.cityId) {
      throw new BadRequestException('El ID de la ciudad es requerido para registrarse como proveedor');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      if (dto.role === RegisterRole.CLIENT) {
        const client = await tx.client.create({
          data: { name: dto.name, phone: dto.phone, email: dto.email },
        });
        return tx.user.create({
          data: {
            phone: dto.phone,
            role: RegisterRole.CLIENT,
            clientId: client.id,
          },
        });
      }

      const provider = await tx.provider.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          description: dto.description,
          cityId: dto.cityId!,
        },
      });
      return tx.user.create({
        data: {
          phone: dto.phone,
          role: RegisterRole.PROVIDER,
          providerId: provider.id,
        },
      });
    });

    const tokens = await this.generateTokens(user.id, user.role);

    this.logger.log(`Usuario registrado: ${user.id} (${dto.role})`);

    return {
      message: 'Registro exitoso',
      user: { id: user.id, phone: user.phone, role: user.role },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    await this.verifyOtp(dto.phone, dto.code);

    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) {
      throw new UnauthorizedException('El teléfono no está registrado');
    }

    const tokens = await this.generateTokens(user.id, user.role);

    this.logger.log(`Usuario autenticado: ${user.id}`);

    return {
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, phone: user.phone, role: user.role },
      ...tokens,
    };
  }

  async refresh(dto: RefreshDto) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const tokens = await this.generateTokens(stored.userId, stored.role);

    return {
      message: 'Sesión renovada exitosamente',
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    this.logger.log(`Sesión cerrada para usuario: ${userId}`);

    return { message: 'Sesión cerrada exitosamente' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
        provider: { include: { city: true } },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { client, provider, ...userData } = user;
    return { user: userData, client, provider };
  }
}
