import { Module, Global } from '@nestjs/common';
import { AuditPublisher } from './services/audit.publisher';
import { AuditWriter } from './services/audit.writer';
import { AuditController } from './controllers/audit.controller';
import { AuditActivityProvider } from './providers/audit-activity.provider';

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditPublisher, AuditWriter, AuditActivityProvider],
  exports: [AuditPublisher],
})
export class AuditModule {}
