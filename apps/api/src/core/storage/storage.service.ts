import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioStorageProvider } from '@patterns/storage-minio';
import { StorageProvider } from '@patterns/storage';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private provider!: MinioStorageProvider;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.provider = new MinioStorageProvider({
      endPoint: this.configService.get<string>('STORAGE_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('STORAGE_PORT', 9000),
      useSSL: this.configService.get<boolean>('STORAGE_USE_SSL', false),
      accessKey: this.configService.get<string>('STORAGE_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('STORAGE_SECRET_KEY', 'minioadmin'),
      region: this.configService.get<string>('STORAGE_REGION', 'us-east-1'),
    });

    try {
      // Hot reload trigger 2
      await this.provider.initializeBuckets();
      this.logger.log('StorageService initialized with MinIO provider and buckets created');
    } catch (e: any) {
      this.logger.error('Failed to initialize MinIO buckets: ' + e?.message);
    }
  }

  getProvider(): StorageProvider {
    return this.provider;
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.provider.list('patterns-public');
      return true;
    } catch {
      return false;
    }
  }
}
