import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { AuditPublisher } from '@modules/audit/services/audit.publisher';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

const SHOPIFY = 'SHOPIFY';

@Injectable()
export class ShopifyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditPublisher: AuditPublisher,
  ) {}

  async connect(workspaceId: string, integrationId: string, userId: string): Promise<any> {
    const integration = await this.validateShopifyIntegration(workspaceId, integrationId);

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
      action: 'SHOPIFY_CONNECTED',
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
    const integration = await this.validateShopifyIntegration(workspaceId, integrationId);

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
      action: 'SHOPIFY_ROTATED_SECRET',
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
    const integration = await this.validateShopifyIntegration(workspaceId, integrationId);

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

    if (integration.type !== SHOPIFY) {
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
      // For this phase, CONNECTED is reserved for future handshake.
      // We do NOT set it to CONNECTED on simple verifyCredentials according to user instruction:
      // "CONNECTED is reserved for a future verification phase and will never be set in Phase 1.6."
      // Let's remove connectionStatus update.
    }

    const updated = await this.prisma.integration.update({
      where: { id: integration.id },
      data: updateData,
    });

    return { ...updated, workspace: (integration as any).workspace };
  }

  private async validateShopifyIntegration(workspaceId: string, integrationId: string) {
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

    if (integration.type !== SHOPIFY) {
      throw new BadRequestException('Operation only supported for SHOPIFY integrations');
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
