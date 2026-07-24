import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario con OTP' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos, código OTP incorrecto o teléfono ya registrado' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con OTP' })
  @ApiResponse({ status: 201, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Código OTP incorrecto o teléfono no registrado' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token con refresh token' })
  @ApiResponse({ status: 201, description: 'Tokens renovados exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión (revocar todos los refresh tokens)' })
  @ApiResponse({ status: 201, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }
}
