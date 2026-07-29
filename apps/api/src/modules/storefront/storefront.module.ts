import { Module } from '@nestjs/common';
import { StorefrontController } from './controllers/storefront.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { IntegrationModule } from '@modules/integration/integration.module';
import { StorefrontJwtGuard } from './guards/storefront-jwt.guard';
import { StorefrontCompositeGuard } from './guards/storefront-composite.guard';

@Module({
  imports: [AuthModule, IntegrationModule],
  controllers: [StorefrontController],
  providers: [StorefrontJwtGuard, StorefrontCompositeGuard],
})
export class StorefrontModule {}
