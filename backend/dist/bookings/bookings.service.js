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
    async create(clientId, dto) {
        const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
        if (!service)
            throw new common_1.NotFoundException('Servicio no encontrado');
        const provider = await this.prisma.provider.findUnique({ where: { id: dto.providerId } });
        if (!provider)
            throw new common_1.NotFoundException('Proveedor no encontrado');
        return this.prisma.booking.create({
            data: {
                clientId,
                providerId: dto.providerId,
                serviceId: dto.serviceId,
                scheduledAt: new Date(dto.scheduledAt),
                address: dto.address,
                notes: dto.notes,
                totalPrice: service.price,
            },
            include: { client: true, provider: true, service: true },
        });
    }
    async findByClient(clientId) {
        return this.prisma.booking.findMany({
            where: { clientId },
            include: { provider: true, service: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { client: true, provider: true, service: true, review: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Reserva no encontrada');
        return booking;
    }
    async updateStatus(id, dto) {
        const booking = await this.findById(id);
        return this.prisma.booking.update({
            where: { id },
            data: { status: dto.status },
            include: { client: true, provider: true, service: true },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map