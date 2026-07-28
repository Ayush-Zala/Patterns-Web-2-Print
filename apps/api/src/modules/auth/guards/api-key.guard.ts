import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { NativeWebsiteService } from '@modules/integration/services/native-website.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => NativeWebsiteService))
    private readonly nativeWebsiteService: NativeWebsiteService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string;
    const apiSecret = request.headers['x-api-secret'] as string;

    if (!apiKey || !apiSecret) {
      throw new UnauthorizedException('Missing x-api-key or x-api-secret headers');
    }

    try {
      const integration = await this.nativeWebsiteService.verifyCredentials(apiKey, apiSecret);

      request.integration = integration;
      request.context = {
        workspace: (integration as any).workspace,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid API Key or Secret');
    }
  }
}
