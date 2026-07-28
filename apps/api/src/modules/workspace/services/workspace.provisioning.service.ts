import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WORKSPACE_CONSTANTS } from '../constants/workspace.constants';
import { ChannelType } from '@patterns/prisma';

@Injectable()
export class WorkspaceProvisioningService {
  private readonly logger = new Logger(WorkspaceProvisioningService.name);

  constructor(private readonly workspaceService: WorkspaceService) {}

  async provisionDefaultWorkspace(ownerId: string): Promise<void> {
    try {
      await this.workspaceService.create(
        {
          name: 'Patterns Workspace',
          description: 'Your default workspace',
          defaultChannel: ChannelType.CUSTOM,
          settings: {
            theme: {
              timezone: 'UTC',
              currency: 'USD',
              language: 'en',
              dateFormat: 'YYYY-MM-DD',
              timeFormat: 'HH:mm',
            },
            branding: {},
            storage: {},
            notifications: { email: true, sms: false },
            features: {
              editorEnabled: true,
              shopifyEnabled: false,
              wordpressEnabled: false,
              apiEnabled: true,
            },
          },
          preferences: {},
        },
        ownerId,
        'system',
      );
      this.logger.log(`Provisioned default workspace for user ${ownerId}`);
    } catch (error) {
      this.logger.error(`Failed to provision default workspace for user ${ownerId}`, error);
      // Depending on requirements, we might want to throw or let it fail gracefully.
    }
  }
}
