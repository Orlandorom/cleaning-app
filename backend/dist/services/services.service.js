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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.service.findUnique({ where: { name: dto.name } });
        if (existing) {
            throw new common_1.ConflictException(`El servicio "${dto.name}" ya existe`);
        }
        return this.prisma.service.create({ data: dto });
    }
    async findAll(query) {
        const where = {};
        if (query?.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }
        if (query?.type) {
            where.type = query.type;
        }
        return this.prisma.service.findMany({ where, orderBy: { name: 'asc' } });
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({ where: { id } });
        if (!service) {
            throw new common_1.NotFoundException(`Servicio con id "${id}" no encontrado`);
        }
        return service;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.name) {
            const existing = await this.prisma.service.findUnique({ where: { name: dto.name } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`El servicio "${dto.name}" ya existe`);
            }
        }
        return this.prisma.service.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.service.delete({ where: { id } });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map