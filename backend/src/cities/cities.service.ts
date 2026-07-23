import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { QueryCityDto } from './dto/query-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCityDto) {
    const existing = await this.prisma.city.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(`La ciudad "${dto.name}" ya existe`);
    }
    return this.prisma.city.create({ data: dto });
  }

  async findAll(query?: QueryCityDto) {
    const where = query?.search
      ? { name: { contains: query.search, mode: 'insensitive' as const } }
      : {};
    return this.prisma.city.findMany({ where, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`Ciudad con id "${id}" no encontrada`);
    }
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.city.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`La ciudad "${dto.name}" ya existe`);
      }
    }
    return this.prisma.city.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.city.delete({ where: { id } });
  }
}
