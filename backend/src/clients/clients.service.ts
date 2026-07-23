import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    const existing = await this.prisma.client.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
    }
    return this.prisma.client.create({ data: dto });
  }

  async findAll(query?: QueryClientDto) {
    const where = query?.search
      ? { name: { contains: query.search, mode: 'insensitive' as const } }
      : {};
    return this.prisma.client.findMany({ where, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente con id "${id}" no encontrado`);
    }
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id);
    if (dto.phone) {
      const existing = await this.prisma.client.findUnique({ where: { phone: dto.phone } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`El teléfono "${dto.phone}" ya está registrado`);
      }
    }
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.delete({ where: { id } });
  }
}
