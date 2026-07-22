import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const provider = await this.prisma.provider.findUnique({ where: { id: dto.providerId } });
    if (!provider) throw new NotFoundException('Proveedor no encontrado');

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

  async findByClient(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: { provider: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { client: true, provider: true, service: true, review: true },
    });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    try {
      return await this.prisma.booking.update({
        where: { id },
        data: { status: dto.status },
        include: { client: true, provider: true, service: true },
      });
    } catch {
      throw new NotFoundException('Reserva no encontrada');
    }
  }
}
