import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        quietReqLogger: true,
        genReqId: () => randomUUID(),
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        autoLogging: {
          ignore: (req) => ['/health', '/ready', '/metrics'].includes(req.url ?? ''),
        },
        customProps: (req) => ({
          correlationId: (req as any)['x-correlation-id'] || randomUUID(),
        }),
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            correlationId: (req as any)['x-correlation-id'],
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
  ],
})
export class LoggerModule {}
