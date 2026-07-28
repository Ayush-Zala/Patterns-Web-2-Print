import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

import { GlobalExceptionFilter } from '@common/exceptions/global-exception.filter';
import { PrismaExceptionFilter } from '@common/filters/prisma-exception.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { VALIDATION_OPTIONS } from '@common/constants/validation.constants';
import { API_PREFIX, SWAGGER_CONFIG } from '@common/constants/api.constants';
import { ApiVersion } from '@common/enums/api-version.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  // Set Pino as the global logger
  app.useLogger(logger);
  app.flushLogs();

  // Security
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string[]>('cors.origins') ?? [],
    credentials: true,
  });

  // Compression
  app.use(compression());

  // Global Prefix & Versioning
  app.setGlobalPrefix(API_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ApiVersion.V1,
  });

  // Global Pipes, Filters, and Interceptors
  app.useGlobalPipes(new ValidationPipe(VALIDATION_OPTIONS));
  app.useGlobalFilters(new GlobalExceptionFilter(), new PrismaExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Graceful Shutdown
  app.enableShutdownHooks();

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth()
    // Pre-populated tags for future modules
    .addTag('System')
    .addTag('Health')
    .addTag('Authentication')
    .addTag('Workspace')
    .addTag('Products')
    .addTag('Assets')
    .addTag('Templates')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, document);

  // Start Application
  const port = configService.get<number>('port') || 4000;
  await app.listen(port);

  logger.log(`Application successfully started on port ${port}`, 'Bootstrap');
}
bootstrap();
