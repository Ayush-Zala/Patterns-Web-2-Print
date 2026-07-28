import { Module } from '@nestjs/common';
import { IntegrationController } from './controllers/integration.controller';
import { IntegrationService } from './services/integration.service';
import { NativeWebsiteService } from './services/native-website.service';
import { IntegrationRepository } from './repositories/integration.repository';
import { IntegrationMapper } from './mappers/integration.mapper';
import { AuditModule } from '@modules/audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [IntegrationController],
  providers: [IntegrationService, NativeWebsiteService, IntegrationRepository, IntegrationMapper],
  exports: [IntegrationService, NativeWebsiteService],
})
export class IntegrationModule {}
