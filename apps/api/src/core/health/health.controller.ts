import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { APP_NAME } from '@common/constants/app.constants';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { StorageService } from '../storage/storage.service';

@ApiTags('Health')
@Controller('system/health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check API and infrastructure health status' })
  async check() {
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    const redisConnected = await this.redis.ping();
    const redisStatus = redisConnected ? 'connected' : 'disconnected';

    const storageConnected = await this.storage.checkHealth();
    const storageStatus = storageConnected ? 'connected' : 'disconnected';

    return {
      status: 'ok',
      application: APP_NAME,
      version: '1.0.0',
      environment: this.configService.get<string>('NODE_ENV'),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          provider: 'postgresql',
        },
        redis: {
          status: redisStatus,
        },
        storage: {
          status: storageStatus,
          provider: 'minio',
        },
      },
    };
  }
}
