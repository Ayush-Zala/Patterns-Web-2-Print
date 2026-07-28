import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { WorkspaceContext } from '@patterns/types';

export const WorkspaceId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.context || request.context.type !== 'workspace') {
    throw new ForbiddenException('Workspace context is required');
  }
  const context = request.context as WorkspaceContext;
  return context.workspace.id;
});
