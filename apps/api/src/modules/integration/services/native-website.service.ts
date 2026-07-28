import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { AuditPublisher } from '@modules/audit/services/audit.publisher';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

// Note: Instead of importing IntegrationType from @prisma/client which is failing, we can define it locally or use string literal.
// We know it is NATIVE_WEBSITE
const NATIVE_WEBSITE = 'NATIVE_WEBSITE';

@Injectable()
export class NativeWebsiteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditPublisher: AuditPublisher,
  ) {}

  async connect(workspaceId: string, integrationId: string, userId: string): Promise<any> {
    const integration = await this.validateNativeIntegration(workspaceId, integrationId);

    if ((integration as any).apiKey) {
      throw new BadRequestException(
        'Credentials already exist for this integration. Use rotate-secret instead.',
      );
    }

    const { apiKey, apiSecret, apiSecretHash } = await this.generateCredentials();

    const updated = await this.prisma.integration.update({
      where: { id: integrationId },
      data: {
        apiKey,
        apiSecretHash,
        credentialsGeneratedAt: new Date(),
        connectionStatus: 'PENDING',
        version: { increment: 1 },
      } as any,
    });

    this.auditPublisher.publish({
      action: 'NATIVE_WEBSITE_CONNECT',
      resource: 'Integration',
      resourceId: integrationId,
      userId,
      workspaceId,
      metadata: { integrationId, type: integration.type },
    });

    return {
      integration: updated,
      apiSecret, // Returned exactly once
    };
  }

  async rotateSecret(workspaceId: string, integrationId: string, userId: string): Promise<any> {
    const integration = await this.validateNativeIntegration(workspaceId, integrationId);

    const { apiSecret, apiSecretHash } = await this.generateCredentials();

    const updated = await this.prisma.integration.update({
      where: { id: integrationId },
      data: {
        apiSecretHash,
        credentialsGeneratedAt: new Date(),
        connectionStatus: 'PENDING',
        version: { increment: 1 },
      } as any,
    });

    this.auditPublisher.publish({
      action: 'NATIVE_WEBSITE_ROTATE_SECRET',
      resource: 'Integration',
      resourceId: integrationId,
      userId,
      workspaceId,
      metadata: { integrationId, type: integration.type },
    });

    return {
      integration: updated,
      apiSecret, // Returned exactly once
    };
  }

  async getStatus(workspaceId: string, integrationId: string) {
    const integration = await this.validateNativeIntegration(workspaceId, integrationId);

    return {
      connectionStatus: (integration as any).connectionStatus,
      lastVerifiedAt: (integration as any).lastVerifiedAt,
      credentialsGeneratedAt: (integration as any).credentialsGeneratedAt,
      apiKey: (integration as any).apiKey,
    };
  }

  async verifyCredentials(apiKey: string, apiSecret: string): Promise<any> {
    const integration = await this.prisma.integration.findUnique({
      where: { apiKey },
      include: { workspace: true },
    });

    if (!integration || integration.deletedAt || integration.status !== 'ACTIVE') {
      throw new BadRequestException('Invalid API Key');
    }

    if (integration.type !== NATIVE_WEBSITE) {
      throw new BadRequestException('Invalid Integration Type');
    }

    const apiSecretHash = (integration as any).apiSecretHash;
    if (!apiSecretHash) {
      throw new BadRequestException('Credentials not generated');
    }

    const isValid = await argon2.verify(apiSecretHash, apiSecret);
    if (!isValid) {
      throw new BadRequestException('Invalid API Secret');
    }

    const updateData: any = {
      lastVerifiedAt: new Date(),
    };

    if ((integration as any).connectionStatus === 'PENDING') {
      updateData.connectionStatus = 'CONNECTED';

      this.auditPublisher.publish({
        action: 'NATIVE_WEBSITE_CONNECTED',
        resource: 'Integration',
        resourceId: integration.id,
        userId: 'system',
        workspaceId: integration.workspaceId,
        metadata: { integrationId: integration.id, type: integration.type },
      });
    }

    const updated = await this.prisma.integration.update({
      where: { id: integration.id },
      data: updateData,
    });

    return { ...updated, workspace: (integration as any).workspace };
  }

  private async validateNativeIntegration(workspaceId: string, integrationId: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        id: integrationId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!integration) {
      throw new BadRequestException('Integration not found');
    }

    if (integration.type !== NATIVE_WEBSITE) {
      throw new BadRequestException('Operation only supported for Native Website integrations');
    }

    return integration;
  }

  private async generateCredentials() {
    const apiKey = 'pk_' + crypto.randomBytes(16).toString('hex');
    const apiSecret = 'sk_' + crypto.randomBytes(32).toString('hex');
    const apiSecretHash = await argon2.hash(apiSecret);

    return { apiKey, apiSecret, apiSecretHash };
  }
}
