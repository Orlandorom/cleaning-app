import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckService, PrismaHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar estado general del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio saludable' })
  @ApiResponse({ status: 503, description: 'Servicio no disponible' })
  check() {
    return this.health.check([() => this.prismaIndicator.pingCheck('database', this.prisma)]);
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar si el servicio está listo para recibir tráfico' })
  @ApiResponse({ status: 200, description: 'Servicio listo' })
  @ApiResponse({ status: 503, description: 'Servicio no listo' })
  readiness() {
    return this.health.check([() => this.prismaIndicator.pingCheck('database', this.prisma)]);
  }
}
