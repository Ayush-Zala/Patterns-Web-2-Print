import { Injectable, Logger } from '@nestjs/common';
import { ActivityProviderRegistry, ActivityEvent } from './activity-provider.registry';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(private readonly registry: ActivityProviderRegistry) {}

  async getRecentActivity(workspaceId: string, limit: number = 10): Promise<ActivityEvent[]> {
    const providers = this.registry.getProviders();
    const allActivities: ActivityEvent[] = [];

    // Fetch from all providers concurrently
    await Promise.all(
      providers.map(async (provider) => {
        try {
          const activities = await provider.getActivities(workspaceId, limit);
          allActivities.push(...activities);
        } catch (err) {
          this.logger.error(`Activity provider ${provider.name} failed`, err);
        }
      }),
    );

    // Sort by timestamp descending
    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Return the top N activities
    return allActivities.slice(0, limit);
  }
}
