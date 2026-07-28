import { Module, Global } from '@nestjs/common';
import { ActivityProviderRegistry } from './services/activity-provider.registry';
import { ActivityService } from './services/activity.service';

@Global()
@Module({
  providers: [ActivityProviderRegistry, ActivityService],
  exports: [ActivityProviderRegistry, ActivityService],
})
export class ActivityModule {}
