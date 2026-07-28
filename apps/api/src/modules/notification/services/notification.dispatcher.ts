import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { CodeGeneratorService } from '@core/services/code-generator.service';

export interface NotificationEvent {
  userId: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SYSTEM';
}

@Injectable()
export class NotificationDispatcher {
  private readonly logger = new Logger(NotificationDispatcher.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly codeGenerator: CodeGeneratorService,
  ) {}

  async dispatch(event: NotificationEvent): Promise<void> {
    try {
      // In the future, this checks user preferences and dispatches to Email, SMS, Push, etc.
      // For now, it only stores in-app notifications.

      const publicId = await this.codeGenerator.generatePublicId('not');

      await this.prisma.notification.create({
        data: {
          publicId,
          userId: event.userId,
          title: event.title,
          message: event.message,
          type: event.type || 'INFO',
        },
      });
    } catch (error) {
      this.logger.error('Failed to dispatch notification', error);
    }
  }
}
