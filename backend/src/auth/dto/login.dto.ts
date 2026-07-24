import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+573001234567', description: 'Número de teléfono en formato internacional' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Debe ser un número válido en formato internacional (ej: +573001234567)' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'Código OTP de 6 dígitos' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
