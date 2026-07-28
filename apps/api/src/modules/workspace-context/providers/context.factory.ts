import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  RequestContext,
  AnonymousContext,
  AuthenticatedContext,
  WorkspaceContext,
} from '@patterns/types';
import { WorkspaceResolverService } from '../services/workspace-resolver.service';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { HEADERS } from '@patterns/constants';
import { Request } from 'express';

@Injectable()
export class ContextFactory {
  constructor(
    private readonly workspaceResolver: WorkspaceResolverService,
    private readonly prisma: PrismaService,
  ) {}

  async buildContext(req: Request): Promise<RequestContext> {
    // 1. Resolve User and Session from request (Assuming JWT guard already populated req.user)
    const reqUser: any = (req as any).user;
    if (!reqUser) {
      return this.resolveAnonymousContext();
    }

    const user = await this.prisma.user.findUnique({ where: { id: reqUser.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const session = await this.prisma.session.findUnique({ where: { id: reqUser.sessionId } });
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    // 2. Resolve Workspace
    const headerWorkspaceId = req.headers[HEADERS.WORKSPACE_ID] as string | undefined;

    let activeWorkspaceId = session.activeWorkspaceId;

    if (headerWorkspaceId) {
      // Temporary override just for this request
      activeWorkspaceId = headerWorkspaceId;
    }

    if (!activeWorkspaceId) {
      return this.resolveAuthenticatedContext(user, session);
    }

    const workspace = await this.workspaceResolver.resolveOwnedWorkspace(
      user.id,
      activeWorkspaceId,
    );

    if (!workspace) {
      // If the workspace in session is deleted or invalid, fallback to AuthenticatedContext
      return this.resolveAuthenticatedContext(user, session);
    }

    // 3. (Future) Resolve Channel, Integration, Locale, Timezone...

    return this.resolveWorkspaceContext(user, session, workspace);
  }

  private resolveAnonymousContext(): AnonymousContext {
    return { type: 'anonymous' };
  }

  private resolveAuthenticatedContext(user: any, session: any): AuthenticatedContext {
    return {
      type: 'authenticated',
      user,
      session,
    };
  }

  private resolveWorkspaceContext(user: any, session: any, workspace: any): WorkspaceContext {
    return {
      type: 'workspace',
      user,
      session,
      workspace,
    };
  }
}
