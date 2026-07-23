import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    const [client, provider, service] = await Promise.all([
      this.prisma.client.findUnique({ where: { id: dto.clientId } }),
      this.prisma.provider.findUnique({ where: { id: dto.providerId } }),
      this.prisma.service.findUnique({ where: { id: dto.serviceId } }),
    ]);

    if (!client) throw new NotFoundException(`Cliente con id "${dto.clientId}" no encontrado`);
    if (!provider) throw new NotFoundException(`Proveedor con id "${dto.providerId}" no encontrado`);
    if (!service) throw new NotFoundException(`Servicio con id "${dto.serviceId}" no encontrado`);

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

  async findAll(query?: QueryBookingDto) {
    const where: any = {};
    if (query?.clientId) where.clientId = query.clientId;
    if (query?.providerId) where.providerId = query.providerId;
    if (query?.status) where.status = query.status;
    return this.prisma.booking.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      include: { client: true, provider: true, service: true },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { client: true, provider: true, service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Reserva con id "${id}" no encontrada`);
    }
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    await this.findOne(id);
    const data: any = {};
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.scheduledAt !== undefined) data.scheduledAt = new Date(dto.scheduledAt);
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.totalPrice !== undefined) data.totalPrice = dto.totalPrice;
    return this.prisma.booking.update({
      where: { id },
      data,
      include: { client: true, provider: true, service: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}
