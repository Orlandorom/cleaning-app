import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryClientDto {
  @ApiPropertyOptional({ example: 'Carlos', description: 'Buscar clientes por nombre' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;
}
