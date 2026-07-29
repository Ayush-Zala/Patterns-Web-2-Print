import { Webhook, WebhookDelivery } from '@patterns/prisma';
import { WebhookResponseDto, WebhookDeliveryResponseDto } from '../dto/webhook-response.dto';

export class WebhooksMapper {
  static toResponseDto(webhook: Webhook): WebhookResponseDto {
    return {
      id: webhook.id,
      workspaceId: webhook.workspaceId,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
    };
  }

  static toDeliveryResponseDto(delivery: WebhookDelivery): WebhookDeliveryResponseDto {
    const dto = new WebhookDeliveryResponseDto();
    dto.id = delivery.id;
    dto.webhookId = delivery.webhookId;
    dto.workspaceId = delivery.workspaceId;
    dto.event = delivery.event;
    dto.attempt = delivery.attempt;
    dto.createdAt = delivery.createdAt;

    if (delivery.responseStatus !== null) dto.responseStatus = delivery.responseStatus;
    if (delivery.latency !== null) dto.latency = delivery.latency;
    if (delivery.nextRetryAt !== null) dto.nextRetryAt = delivery.nextRetryAt;
    if (delivery.deliveredAt !== null) dto.deliveredAt = delivery.deliveredAt;
    if (delivery.errorMessage !== null) dto.errorMessage = delivery.errorMessage;

    return dto;
  }
}
