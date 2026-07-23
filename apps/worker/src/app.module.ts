import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkerService } from './worker.service';
import { AssetJobProcessor } from './processors/asset.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [WorkerService, AssetJobProcessor],
})
export class AppModule {}
