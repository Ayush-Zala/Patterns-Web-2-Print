import { Injectable, Logger } from '@nestjs/common';
import { NotificationDispatcher, NotificationEvent } from './notification.dispatcher';

@Injectable()
export class NotificationPublisher {
  private readonly logger = new Logger(NotificationPublisher.name);

  constructor(private readonly dispatcher: NotificationDispatcher) {}

  publish(event: NotificationEvent): void {
    setImmediate(() => {
      this.dispatcher.dispatch(event).catch((err) => {
        this.logger.error('Failed to process published notification', err);
      });
    });
  }
}
