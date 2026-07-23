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
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProvidersService = class ProvidersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.provider.findUnique({ where: { phone: dto.phone } });
        if (existing) {
            throw new common_1.ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
        }
        return this.prisma.provider.create({ data: dto, include: { city: true } });
    }
    async findAll(query) {
        const where = {};
        if (query?.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }
        if (query?.isAvailable !== undefined) {
            where.isAvailable = query.isAvailable;
        }
        if (query?.cityId) {
            where.cityId = query.cityId;
        }
        return this.prisma.provider.findMany({ where, orderBy: { name: 'asc' }, include: { city: true } });
    }
    async findOne(id) {
        const provider = await this.prisma.provider.findUnique({ where: { id }, include: { city: true } });
        if (!provider) {
            throw new common_1.NotFoundException(`Proveedor con id "${id}" no encontrado`);
        }
        return provider;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.phone) {
            const existing = await this.prisma.provider.findUnique({ where: { phone: dto.phone } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
            }
        }
        return this.prisma.provider.update({ where: { id }, data: dto, include: { city: true } });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.provider.delete({ where: { id } });
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map