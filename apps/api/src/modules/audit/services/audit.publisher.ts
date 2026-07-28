import { Injectable, Logger } from '@nestjs/common';
import { AuditWriter, AuditEvent } from './audit.writer';

@Injectable()
export class AuditPublisher {
  private readonly logger = new Logger(AuditPublisher.name);

  constructor(private readonly auditWriter: AuditWriter) {}

  /**
   * Publishes an audit event to be written asynchronously.
   * In the future, this will push to a Queue (BullMQ) instead of writing directly.
   */
  publish(event: AuditEvent): void {
    // Fire and forget, simulating a queue publish
    setImmediate(() => {
      this.auditWriter.write(event).catch((err) => {
        this.logger.error('Failed to process published audit event', err);
      });
    });
  }
}
