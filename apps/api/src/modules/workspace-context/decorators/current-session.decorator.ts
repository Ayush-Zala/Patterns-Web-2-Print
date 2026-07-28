import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthenticatedContext, WorkspaceContext } from '@patterns/types';
import { Session } from '@patterns/prisma';

export const CurrentSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    if (
      !request.context ||
      (request.context.type !== 'authenticated' && request.context.type !== 'workspace')
    ) {
      throw new ForbiddenException('Authenticated context is required');
    }
    const context = request.context as AuthenticatedContext | WorkspaceContext;
    return context.session as Session;
  },
);
