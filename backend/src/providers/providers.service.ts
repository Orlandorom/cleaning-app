import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProviderDto } from './dto/query-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProviderDto) {
    const existing = await this.prisma.provider.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
    }
    return this.prisma.provider.create({ data: dto, include: { city: true } });
  }

  async findAll(query?: QueryProviderDto) {
    const where: any = {};
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

  async findOne(id: string) {
    const provider = await this.prisma.provider.findUnique({ where: { id }, include: { city: true } });
    if (!provider) {
      throw new NotFoundException(`Proveedor con id "${id}" no encontrado`);
    }
    return provider;
  }

  async update(id: string, dto: UpdateProviderDto) {
    await this.findOne(id);
    if (dto.phone) {
      const existing = await this.prisma.provider.findUnique({ where: { phone: dto.phone } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
      }
    }
    return this.prisma.provider.update({ where: { id }, data: dto, include: { city: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.provider.delete({ where: { id } });
  }
}
