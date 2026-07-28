import { Module } from '@nestjs/common';
import { StorefrontController } from './controllers/storefront.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { IntegrationModule } from '@modules/integration/integration.module';

@Module({
  imports: [AuthModule, IntegrationModule],
  controllers: [StorefrontController],
})
export class StorefrontModule {}
