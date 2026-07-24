import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

const registry = new Registry();

collectDefaultMetrics({ register: registry });

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry],
});

export const httpRequestTotal = new Counter({
  name: 'http_request_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry],
});

@ApiTags('Metrics')
@Controller()
export class MetricsController {
  @Get('metrics')
  @ApiOperation({ summary: 'Exportar métricas en formato Prometheus' })
  @ApiResponse({ status: 200, description: 'Métricas exportadas correctamente' })
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', registry.contentType);
    const metrics = await registry.metrics();
    res.end(metrics);
  }
}
