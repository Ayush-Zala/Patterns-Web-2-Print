import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthMapper } from './mappers/auth.mapper';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IdentityModule } from '../identity/identity.module';
import { ApiKeyGuard } from './guards/api-key.guard';

import { ApiKeyRateLimitGuard } from './guards/api-key-rate-limit.guard';

@Module({
  imports: [
    IdentityModule,
    forwardRef(() => import('../integration/integration.module').then((m) => m.IntegrationModule)),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtAccessSecret') as string,
        signOptions: {
          expiresIn: configService.get<string>('auth.jwtAccessExpires') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, JwtStrategy, ApiKeyGuard, ApiKeyRateLimitGuard],
  exports: [AuthService, ApiKeyGuard, ApiKeyRateLimitGuard],
})
export class AuthModule {}
