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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const twilio_1 = require("twilio");
const otpStore = new Map();
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (accountSid && authToken) {
            this.twilioClient = new twilio_1.Twilio(accountSid, authToken);
        }
    }
    async sendOtp(phone) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        otpStore.set(phone, { code, expiresAt });
        if (this.twilioClient) {
            await this.twilioClient.messages.create({
                body: `Tu código de verificación es: ${code}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
        }
    }
    async verifyOtp(phone, code) {
        const stored = otpStore.get(phone);
        if (!stored)
            throw new common_1.BadRequestException('No se ha solicitado un código');
        if (new Date() > stored.expiresAt) {
            otpStore.delete(phone);
            throw new common_1.BadRequestException('El código ha expirado');
        }
        if (stored.code !== code)
            throw new common_1.UnauthorizedException('Código incorrecto');
        otpStore.delete(phone);
        let client = await this.prisma.client.findUnique({ where: { phone } });
        if (!client) {
            client = await this.prisma.client.create({ data: { phone, name: '' } });
        }
        const token = this.jwtService.sign({ sub: client.id, phone: client.phone });
        return { token, client: { id: client.id, name: client.name, phone: client.phone } };
    }
    async register(data) {
        const existing = await this.prisma.client.findUnique({ where: { phone: data.phone } });
        if (existing)
            throw new common_1.BadRequestException('El teléfono ya está registrado');
        const client = await this.prisma.client.create({ data });
        const token = this.jwtService.sign({ sub: client.id, phone: client.phone });
        return { token, client: { id: client.id, name: client.name, phone: client.phone, email: client.email ?? undefined } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map