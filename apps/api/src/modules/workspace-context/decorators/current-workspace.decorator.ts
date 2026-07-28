import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { WorkspaceContext } from '@patterns/types';
import { Workspace } from '@patterns/prisma';

export const CurrentWorkspace = createParamDecorator(
  (data: keyof Workspace | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.context || request.context.type !== 'workspace') {
      throw new ForbiddenException('Workspace context is required');
    }
    const context = request.context as WorkspaceContext;
    const workspace = context.workspace as Workspace;
    return data ? workspace[data] : workspace;
  },
);
