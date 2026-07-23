import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    const existing = await this.prisma.service.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(`El servicio "${dto.name}" ya existe`);
    }
    return this.prisma.service.create({ data: dto });
  }

  async findAll(query?: QueryServiceDto) {
    const where: any = {};
    if (query?.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    if (query?.type) {
      where.type = query.type;
    }
    return this.prisma.service.findMany({ where, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Servicio con id "${id}" no encontrado`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.service.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`El servicio "${dto.name}" ya existe`);
      }
    }
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.delete({ where: { id } });
  }
}
