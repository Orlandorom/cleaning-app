"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const correlation_id_middleware_1 = require("./common/middleware/correlation-id.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const pinoLogger = app.get(nestjs_pino_1.Logger);
    app.useLogger(pinoLogger);
    const configService = app.get(config_1.ConfigService);
    const correlationMiddleware = new correlation_id_middleware_1.CorrelationIdMiddleware();
    app.use((req, res, next) => correlationMiddleware.use(req, res, next));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Cleaning App API')
        .setDescription('API para el sistema de servicios de aseo')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const corsOrigins = configService.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:19006').split(',');
    app.enableCors({ origin: corsOrigins, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    pinoLogger.log(`Servidor corriendo en puerto ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map