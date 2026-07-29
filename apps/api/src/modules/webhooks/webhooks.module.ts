import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@patterns/constants';
import { WebhooksController } from './controllers/webhooks.controller';
import { WebhooksService } from './services/webhooks.service';
import { WebhookDispatcher } from './services/webhook.dispatcher';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.WEBHOOKS,
    }),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookDispatcher],
  exports: [WebhooksService],
})
export class WebhooksModule {}
