import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto {
  @ApiPropertyOptional({ example: 'CONFIRMED', description: 'Estado de la reserva', enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ example: '2026-08-01T16:00:00Z', description: 'Nueva fecha programada' })
  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @ApiPropertyOptional({ example: 'Calle 456 #78-90', description: 'Nueva dirección' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Nota actualizada', description: 'Nuevas notas' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 200000, description: 'Nuevo precio total', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;
}
