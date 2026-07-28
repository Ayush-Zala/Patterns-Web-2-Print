import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { CodeGeneratorService } from '@core/services/code-generator.service';

export interface AuditEvent {
  userId?: string;
  workspaceId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

@Injectable()
export class AuditWriter {
  private readonly logger = new Logger(AuditWriter.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly codeGenerator: CodeGeneratorService,
  ) {}

  async write(event: AuditEvent): Promise<void> {
    try {
      const publicId = await this.codeGenerator.generatePublicId('aud');

      await this.prisma.auditLog.create({
        data: {
          publicId,
          userId: event.userId || null,
          workspaceId: event.workspaceId || null,
          action: event.action,
          resource: event.resource,
          resourceId: event.resourceId || null,
          metadata: (event.metadata || {}) as any,
          ipAddress: event.ipAddress || null,
          userAgent: event.userAgent || null,
          requestId: event.requestId || null,
        },
      });
    } catch (error) {
      this.logger.error('Failed to write audit log', error);
    }
  }
}
