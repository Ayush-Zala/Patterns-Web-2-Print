import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@patterns/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasourceUrl: configService.get<string>('DATABASE_URL')!,
      log: PrismaService.parseLogLevels(configService.get<string>('DATABASE_LOG_LEVEL', 'error,warn')),
    });
  }

  private static parseLogLevels(logLevelStr: string): Prisma.LogLevel[] {
    const levels = logLevelStr.split(',').map((l) => l.trim().toLowerCase());
    return levels.filter((l) => ['info', 'query', 'warn', 'error'].includes(l)) as Prisma.LogLevel[];
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected gracefully');
  }
}
