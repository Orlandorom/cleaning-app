import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryProvidersDto {
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
