import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { WorkspaceContext } from '@patterns/types';
import { ContextFactory } from '../providers/context.factory';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly contextFactory: ContextFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.context) {
      request.context = await this.contextFactory.buildContext(request);
    }

    const reqContext = request.context;

    if (!reqContext || reqContext.type !== 'workspace') {
      throw new ForbiddenException('Workspace context is required but not found');
    }

    const workspaceContext = reqContext as WorkspaceContext;
    const workspace = workspaceContext.workspace;

    if (!workspace) {
      throw new ForbiddenException('Workspace not found in context');
    }

    if (workspace.deletedAt) {
      throw new ConflictException('Workspace is deleted');
    }

    if (workspace.status !== 'ACTIVE') {
      throw new ConflictException('Workspace is inactive or archived');
    }

    return true;
  }
}
