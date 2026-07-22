import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryProvidersDto } from './dto/query-providers.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProvidersDto) {
    const where: Prisma.ProviderWhereInput = { isAvailable: true };

    if (query.serviceId) {
      where.services = { some: { serviceId: query.serviceId } };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.provider.findMany({
      where,
      include: { services: { include: { service: true } } },
    });
  }

  async findById(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: {
        services: { include: { service: true } },
        bookings: { include: { review: true } },
      },
    });
    if (!provider) throw new NotFoundException('Proveedor no encontrado');
    return provider;
  }
}
