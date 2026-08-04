import { Module } from '@nestjs/common';
import { IntegrationController } from './controllers/integration.controller';
import { IntegrationService } from './services/integration.service';
import { NativeWebsiteService } from './services/native-website.service';
import { WordPressService } from './services/wordpress.service';
import { IntegrationRepository } from './repositories/integration.repository';
import { IntegrationMapper } from './mappers/integration.mapper';
import { AuditModule } from '@modules/audit/audit.module';
import { ShopifyService } from './services/shopify.service';
import { ShopifySyncService } from './services/shopify-sync.service';

@Module({
  imports: [AuditModule],
  controllers: [IntegrationController],
  providers: [
    IntegrationService,
    NativeWebsiteService,
    WordPressService,
    ShopifyService,
    ShopifySyncService,
    IntegrationRepository,
    IntegrationMapper,
  ],
  exports: [
    IntegrationService,
    NativeWebsiteService,
    WordPressService,
    ShopifyService,
    ShopifySyncService,
  ],
})
export class IntegrationModule {}
