import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ActivityProviderRegistry,
  ActivityProvider,
  ActivityEvent,
} from '../../activity/services/activity-provider.registry';
import { PrismaService } from '@core/database/prisma/prisma.service';

@Injectable()
export class AuditActivityProvider implements ActivityProvider, OnModuleInit {
  name = 'AuditLog';

  constructor(
    private readonly registry: ActivityProviderRegistry,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.registry.register(this);
  }

  async getActivities(workspaceId: string, limit: number): Promise<ActivityEvent[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    return logs.map((log: any) => {
      const event: ActivityEvent = {
        id: log.id,
        type: 'AUDIT',
        title: log.action,
        description: `Resource: ${log.resource}`,
        metadata: log.metadata,
        timestamp: log.createdAt,
      };

      if (log.user) {
        event.actor = {
          id: log.user.id,
          name: `${log.user.firstName} ${log.user.lastName}`,
          avatarUrl: log.user.avatarUrl || undefined,
        };
      }

      return event;
    });
  }
}
