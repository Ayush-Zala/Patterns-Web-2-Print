import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkerService } from './worker.service';
import { AssetJobProcessor } from './processors/asset.processor';
import { WebhookJobProcessor } from './processors/webhook.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [WorkerService, AssetJobProcessor, WebhookJobProcessor],
})
export class AppModule {}
