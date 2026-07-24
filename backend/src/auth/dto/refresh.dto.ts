import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ example: 'uuid-refresh-token', description: 'Refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
