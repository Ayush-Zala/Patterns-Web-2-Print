import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '@patterns/events';
import { QUEUE_NAMES } from '@patterns/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WebhookDispatcher {
  private readonly logger = new Logger(WebhookDispatcher.name);

  constructor(@InjectQueue(QUEUE_NAMES.WEBHOOKS) private readonly webhooksQueue: Queue) {}

  /**
   * Listen to all domain events (e.g. product.created, workspace.updated)
   * The event name is the 'type' field of the DomainEvent.
   * Event Emitter allows subscribing to wildcard events using '**'.
   */
  @OnEvent('**')
  async handleDomainEvent(event: DomainEvent) {
    if (!event || !event.type || !event.meta?.workspaceId) {
      // Ignore events without a workspace context or type
      return;
    }

    try {
      this.logger.debug(
        `Dispatching event ${event.type} to webhooks queue for workspace ${event.meta.workspaceId}`,
      );

      await this.webhooksQueue.add(
        'process-webhook', // job name
        event,
        {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    } catch (error) {
      this.logger.error(`Failed to dispatch event ${event.type} to webhooks queue`, error);
    }
  }
}
