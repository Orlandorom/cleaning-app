import { IsOptional, IsString, IsBoolean, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProviderDto {
  @ApiPropertyOptional({ example: 'Juan', description: 'Buscar proveedores por nombre' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @ApiPropertyOptional({ example: true, description: 'Filtrar por disponibilidad' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 'uuid-de-la-ciudad', description: 'Filtrar por ciudad' })
  @IsOptional()
  @IsString()
  cityId?: string;
}
