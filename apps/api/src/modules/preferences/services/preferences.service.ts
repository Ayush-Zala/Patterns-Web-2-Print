import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
// import Redis from 'ioredis';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';

export interface PreferencesDto {
  theme?: string;
  language?: string;
  timezone?: string;
  sidebarCollapsed?: boolean;
  dashboardLayout?: any;
  notificationSettings?: any;
}

@Injectable()
export class PreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    // @Inject(CACHE_MANAGER) private readonly cache: Redis, // We'll implement this when global cache is wired
  ) {}

  async getPreferences(userId: string, workspaceId: string): Promise<any> {
    // const cached = await this.cache.get(`prefs:${userId}:${workspaceId}`);
    // if (cached) return JSON.parse(cached as string);

    let prefs = await this.prisma.userPreference.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });

    if (!prefs) {
      prefs = await this.prisma.userPreference.create({
        data: { userId, workspaceId },
      });
    }

    // await this.cache.set(`prefs:${userId}:${workspaceId}`, JSON.stringify(prefs), 'EX', 3600);
    return prefs;
  }

  async updatePreferences(userId: string, workspaceId: string, data: PreferencesDto): Promise<any> {
    const prefs = await this.prisma.userPreference.upsert({
      where: { userId_workspaceId: { userId, workspaceId } },
      create: { userId, workspaceId, ...data },
      update: data,
    });

    // await this.cache.set(`prefs:${userId}:${workspaceId}`, JSON.stringify(prefs), 'EX', 3600);
    return prefs;
  }
}
