"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const register_dto_1 = require("./dto/register.dto");
const crypto_1 = require("crypto");
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const ACCESS_TOKEN_EXPIRY = '60m';
const REFRESH_TOKEN_DAYS = 30;
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async verifyOtp(phone, code) {
        const latest = await this.prisma.otp.findFirst({
            where: { phone, verified: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });
        if (!latest) {
            throw new common_1.BadRequestException('No hay un código OTP vigente. Solicite uno nuevo.');
        }
        if (latest.attempts >= MAX_ATTEMPTS) {
            throw new common_1.BadRequestException('Demasiados intentos fallidos. Solicite un nuevo código.');
        }
        if (latest.code !== code) {
            await this.prisma.otp.update({
                where: { id: latest.id },
                data: { attempts: { increment: 1 } },
            });
            throw new common_1.BadRequestException('Código incorrecto.');
        }
        await this.prisma.otp.update({
            where: { id: latest.id },
            data: { verified: true },
        });
    }
    async generateTokens(userId, role) {
        const accessToken = this.jwtService.sign({ sub: userId, role }, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = (0, crypto_1.randomUUID)();
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
    async register(dto) {
        await this.verifyOtp(dto.phone, dto.code);
        const existingUser = await this.prisma.user.findUnique({
            where: { phone: dto.phone },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('El teléfono ya está registrado');
        }
        if (dto.role === register_dto_1.RegisterRole.PROVIDER && !dto.cityId) {
            throw new common_1.BadRequestException('El ID de la ciudad es requerido para registrarse como proveedor');
        }
        const user = await this.prisma.$transaction(async (tx) => {
            if (dto.role === register_dto_1.RegisterRole.CLIENT) {
                const client = await tx.client.create({
                    data: { name: dto.name, phone: dto.phone, email: dto.email },
                });
                return tx.user.create({
                    data: {
                        phone: dto.phone,
                        role: register_dto_1.RegisterRole.CLIENT,
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
                    cityId: dto.cityId,
                },
            });
            return tx.user.create({
                data: {
                    phone: dto.phone,
                    role: register_dto_1.RegisterRole.PROVIDER,
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
    async login(dto) {
        await this.verifyOtp(dto.phone, dto.code);
        const user = await this.prisma.user.findUnique({
            where: { phone: dto.phone },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('El teléfono no está registrado');
        }
        const tokens = await this.generateTokens(user.id, user.role);
        this.logger.log(`Usuario autenticado: ${user.id}`);
        return {
            message: 'Inicio de sesión exitoso',
            user: { id: user.id, phone: user.phone, role: user.role },
            ...tokens,
        };
    }
    async refresh(dto) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: dto.refreshToken },
        });
        if (!stored || stored.revoked || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token inválido o expirado');
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
    async logout(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });
        this.logger.log(`Sesión cerrada para usuario: ${userId}`);
        return { message: 'Sesión cerrada exitosamente' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                client: true,
                provider: { include: { city: true } },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const { client, provider, ...userData } = user;
        return { user: userData, client, provider };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map