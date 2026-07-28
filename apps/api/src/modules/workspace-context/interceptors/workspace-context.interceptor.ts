import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextFactory } from '../providers/context.factory';

@Injectable()
export class WorkspaceContextInterceptor implements NestInterceptor {
  constructor(private readonly contextFactory: ContextFactory) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Context Factory handles everything including caching if needed,
    // but here we just assign it to the request so ContextProvider can pick it up.
    if (!request.context) {
      request.context = await this.contextFactory.buildContext(request);
    }

    return next.handle();
  }
}
