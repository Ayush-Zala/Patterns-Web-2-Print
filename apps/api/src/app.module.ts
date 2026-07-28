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
import { IdentityModule } from './modules/identity/identity.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { WorkspaceContextModule } from './modules/workspace-context/workspace-context.module';
import { ServicesModule } from './core/services/services.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationModule } from './modules/notification/notification.module';
import { UploadModule } from './modules/upload/upload.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PreferencesModule } from './modules/preferences/preferences.module';
import { ActivityModule } from './modules/activity/activity.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { ProductModule } from './modules/product/product.module';

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
    ServicesModule,
    IdentityModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    WorkspaceContextModule,
    AuditModule,
    NotificationModule,
    UploadModule,
    ProfileModule,
    PreferencesModule,
    ActivityModule,
    IntegrationModule,
    StorefrontModule,
    ProductModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
