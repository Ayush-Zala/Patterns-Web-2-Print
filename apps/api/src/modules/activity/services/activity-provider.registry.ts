import { Injectable, Logger } from '@nestjs/common';

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: any;
  timestamp: Date;
  actor?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ActivityProvider {
  name: string;
  getActivities(workspaceId: string, limit: number): Promise<ActivityEvent[]>;
}

@Injectable()
export class ActivityProviderRegistry {
  private providers: ActivityProvider[] = [];

  register(provider: ActivityProvider) {
    this.providers.push(provider);
  }

  getProviders(): ActivityProvider[] {
    return this.providers;
  }
}
