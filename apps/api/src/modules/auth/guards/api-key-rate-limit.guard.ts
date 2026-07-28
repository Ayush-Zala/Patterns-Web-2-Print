import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { RedisService } from '@core/redis/redis.service';

@Injectable()
export class ApiKeyRateLimitGuard implements CanActivate {
  private readonly LIMIT = 100;
  private readonly TTL_SECONDS = 60;

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      // If there's no API key, we let the ApiKeyGuard catch it.
      // Or we can just block it here. But typically, this guard is run alongside ApiKeyGuard.
      return true;
    }

    const client = this.redisService.getClient();
    const redisKey = `rate-limit:api-key:${apiKey}`;

    // Atomic increment and set expiry if it's a new key
    const currentCount = await client.incr(redisKey);

    if (currentCount === 1) {
      await client.expire(redisKey, this.TTL_SECONDS);
    }

    if (currentCount > this.LIMIT) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
