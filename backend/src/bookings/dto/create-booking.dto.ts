import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  providerId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
