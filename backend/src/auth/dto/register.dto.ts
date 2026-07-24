import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RegisterRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
}

export class RegisterDto {
  @ApiProperty({ example: '+573001234567', description: 'Número de teléfono en formato internacional' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Debe ser un número válido en formato internacional (ej: +573001234567)' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'Código OTP de 6 dígitos' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'CLIENT', description: 'Rol del usuario', enum: RegisterRole })
  @IsEnum(RegisterRole)
  @IsNotEmpty()
  role: RegisterRole;

  @ApiPropertyOptional({ example: 'juan@email.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'uuid-ciudad', description: 'ID de la ciudad (requerido para PROVIDER)' })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiPropertyOptional({ example: 'Profesional con 5 años de experiencia', description: 'Descripción del proveedor' })
  @IsOptional()
  @IsString()
  description?: string;
}
