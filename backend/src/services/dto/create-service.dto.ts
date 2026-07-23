import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ example: 'Limpieza general', description: 'Nombre del servicio', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Servicio completo de limpieza para hogares', description: 'Descripción del servicio' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'GENERAL', description: 'Tipo de servicio', enum: ServiceType })
  @IsEnum(ServiceType)
  @IsNotEmpty()
  type: ServiceType;

  @ApiProperty({ example: 120, description: 'Duración en minutos', minimum: 15 })
  @IsInt()
  @Min(15)
  duration: number;
}
