import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { CreateWebhookDto } from '../dto/create-webhook.dto';
import { UpdateWebhookDto } from '../dto/update-webhook.dto';
import { encrypt, generateEncryptionKey, serializeEncryptedData } from '@patterns/utils';

@Injectable()
export class WebhooksService {
  private readonly encryptionKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const key = this.configService.get<string>('webhooks.secretEncryptionKey');
    if (!key) {
      throw new Error('WEBHOOK_SECRET_ENCRYPTION_KEY is not defined');
    }
    this.encryptionKey = key;
  }

  /**
   * Creates a new webhook and generates its signing secret.
   * The plain text secret is returned ONLY ONCE via the result.
   */
  async createWebhook(workspaceId: string, dto: CreateWebhookDto) {
    const plainTextSecret = `whsec_${generateEncryptionKey()}`;
    const encryptedData = encrypt(plainTextSecret, this.encryptionKey);
    const serializedEncryptedSecret = serializeEncryptedData(encryptedData);

    const webhook = await this.prisma.webhook.create({
      data: {
        workspaceId,
        url: dto.url,
        events: dto.events,
        isActive: dto.isActive ?? true,
        encryptedSecret: serializedEncryptedSecret,
      },
    });

    return { webhook, plainTextSecret };
  }

  async getWebhooks(workspaceId: string) {
    return this.prisma.webhook.findMany({
      where: { workspaceId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWebhook(workspaceId: string, id: string) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id_workspaceId: { id, workspaceId } },
    });

    if (!webhook || webhook.deletedAt) {
      throw new NotFoundException('Webhook not found');
    }

    return webhook;
  }

  async updateWebhook(workspaceId: string, id: string, dto: UpdateWebhookDto) {
    await this.getWebhook(workspaceId, id); // ensure exists

    const data: any = {};
    if (dto.url !== undefined) data.url = dto.url;
    if (dto.events !== undefined) data.events = dto.events;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.webhook.update({
      where: { id_workspaceId: { id, workspaceId } },
      data,
    });
  }

  /**
   * Rotates the signing secret for a webhook.
   * Returns the new plain text secret.
   */
  async rotateSecret(workspaceId: string, id: string) {
    await this.getWebhook(workspaceId, id);

    const plainTextSecret = `whsec_${generateEncryptionKey()}`;
    const encryptedData = encrypt(plainTextSecret, this.encryptionKey);
    const serializedEncryptedSecret = serializeEncryptedData(encryptedData);

    const webhook = await this.prisma.webhook.update({
      where: { id_workspaceId: { id, workspaceId } },
      data: { encryptedSecret: serializedEncryptedSecret },
    });

    return { webhook, plainTextSecret };
  }

  async deleteWebhook(workspaceId: string, id: string) {
    await this.getWebhook(workspaceId, id);

    await this.prisma.webhook.update({
      where: { id_workspaceId: { id, workspaceId } },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async getDeliveries(workspaceId: string, webhookId: string, skip = 0, take = 50) {
    await this.getWebhook(workspaceId, webhookId);

    const [deliveries, total] = await Promise.all([
      this.prisma.webhookDelivery.findMany({
        where: { webhookId, workspaceId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.webhookDelivery.count({
        where: { webhookId, workspaceId },
      }),
    ]);

    return { deliveries, total };
  }
}
