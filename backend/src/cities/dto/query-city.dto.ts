import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCityDto {
  @ApiPropertyOptional({
    example: 'Bog',
    description: 'Buscar ciudades por nombre (búsqueda parcial)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;
}
