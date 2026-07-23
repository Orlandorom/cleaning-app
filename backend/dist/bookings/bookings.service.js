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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const [client, provider, service] = await Promise.all([
            this.prisma.client.findUnique({ where: { id: dto.clientId } }),
            this.prisma.provider.findUnique({ where: { id: dto.providerId } }),
            this.prisma.service.findUnique({ where: { id: dto.serviceId } }),
        ]);
        if (!client)
            throw new common_1.NotFoundException(`Cliente con id "${dto.clientId}" no encontrado`);
        if (!provider)
            throw new common_1.NotFoundException(`Proveedor con id "${dto.providerId}" no encontrado`);
        if (!service)
            throw new common_1.NotFoundException(`Servicio con id "${dto.serviceId}" no encontrado`);
        return this.prisma.booking.create({
            data: {
                clientId: dto.clientId,
                providerId: dto.providerId,
                serviceId: dto.serviceId,
                scheduledAt: new Date(dto.scheduledAt),
                address: dto.address,
                notes: dto.notes,
                totalPrice: dto.totalPrice,
            },
            include: { client: true, provider: true, service: true },
        });
    }
    async findAll(query) {
        const where = {};
        if (query?.clientId)
            where.clientId = query.clientId;
        if (query?.providerId)
            where.providerId = query.providerId;
        if (query?.status)
            where.status = query.status;
        return this.prisma.booking.findMany({
            where,
            orderBy: { scheduledAt: 'desc' },
            include: { client: true, provider: true, service: true },
        });
    }
    async findOne(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { client: true, provider: true, service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Reserva con id "${id}" no encontrada`);
        }
        return booking;
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = {};
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.scheduledAt !== undefined)
            data.scheduledAt = new Date(dto.scheduledAt);
        if (dto.address !== undefined)
            data.address = dto.address;
        if (dto.notes !== undefined)
            data.notes = dto.notes;
        if (dto.totalPrice !== undefined)
            data.totalPrice = dto.totalPrice;
        return this.prisma.booking.update({
            where: { id },
            data,
            include: { client: true, provider: true, service: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.booking.delete({ where: { id } });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map