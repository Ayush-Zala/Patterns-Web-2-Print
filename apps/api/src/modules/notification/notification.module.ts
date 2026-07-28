import { Module, Global } from '@nestjs/common';
import { NotificationPublisher } from './services/notification.publisher';
import { NotificationDispatcher } from './services/notification.dispatcher';
import { NotificationController } from './controllers/notification.controller';

@Global()
@Module({
  controllers: [NotificationController],
  providers: [NotificationPublisher, NotificationDispatcher],
  exports: [NotificationPublisher],
})
export class NotificationModule {}
