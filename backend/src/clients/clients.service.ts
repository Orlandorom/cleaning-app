import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { bookings: true },
    });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    try {
      return await this.prisma.client.update({ where: { id }, data: dto });
    } catch {
      throw new NotFoundException('Cliente no encontrado');
    }
  }
}
