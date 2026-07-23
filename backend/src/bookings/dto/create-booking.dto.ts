import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-del-cliente', description: 'ID del cliente' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'uuid-del-proveedor', description: 'ID del proveedor' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ example: 'uuid-del-servicio', description: 'ID del servicio' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '2026-08-01T14:00:00Z', description: 'Fecha y hora programada' })
  @IsString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del servicio' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 'Dejar llaves en la portería', description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 150000, description: 'Precio total del servicio', minimum: 0 })
  @IsNumber()
  @Min(0)
  totalPrice: number;
}
