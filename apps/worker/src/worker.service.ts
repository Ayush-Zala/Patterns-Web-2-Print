import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { AssetJobProcessor } from './processors/asset.processor';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkerService.name);

  constructor(private readonly assetProcessor: AssetJobProcessor) {}

  onModuleInit() {
    this.logger.log('Starting BullMQ Queue Workers...');
    this.assetProcessor.start();
    this.logger.log('All queue workers started successfully');
  }

  async onModuleDestroy() {
    this.logger.log('Stopping BullMQ Queue Workers...');
    await this.assetProcessor.stop();
    this.logger.log('Queue workers stopped gracefully');
  }
}
