import { IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class QueryServiceDto {
  @ApiPropertyOptional({ example: 'Limpieza', description: 'Buscar servicios por nombre' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @ApiPropertyOptional({ example: 'GENERAL', description: 'Filtrar por tipo de servicio', enum: ServiceType })
  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType;
}
