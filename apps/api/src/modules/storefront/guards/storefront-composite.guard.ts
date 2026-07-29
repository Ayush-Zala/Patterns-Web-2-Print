import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from '@modules/auth/guards/api-key.guard';
import { StorefrontJwtGuard } from './storefront-jwt.guard';

@Injectable()
export class StorefrontCompositeGuard implements CanActivate {
  constructor(
    private readonly apiKeyGuard: ApiKeyGuard,
    private readonly jwtGuard: StorefrontJwtGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const apiKey = request.headers['x-api-key'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return this.jwtGuard.canActivate(context);
    }

    if (apiKey) {
      return this.apiKeyGuard.canActivate(context);
    }

    throw new UnauthorizedException('Missing authentication credentials (Bearer Token or API Key)');
  }
}
