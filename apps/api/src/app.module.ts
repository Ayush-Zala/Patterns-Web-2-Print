import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@config/env.validation';
import configuration from '@config/configuration';
import { LoggerModule } from '@core/logger/logger.module';
import { SystemModule } from '@core/system/system.module';
import { HealthModule } from '@core/health/health.module';
import { DatabaseModule } from '@core/database/database.module';
import { RedisModule } from '@core/redis/redis.module';
import { StorageModule } from '@core/storage/storage.module';
import { RequestIdMiddleware } from '@common/middlewares/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [configuration],
    }),
    LoggerModule,
    SystemModule,
    HealthModule,
    DatabaseModule,
    RedisModule,
    StorageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
