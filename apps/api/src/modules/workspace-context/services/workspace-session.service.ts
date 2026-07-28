import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { WorkspaceResolverService } from './workspace-resolver.service';
import { Workspace, Session } from '@patterns/prisma';

@Injectable()
export class WorkspaceSessionService {
  private readonly logger = new Logger(WorkspaceSessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceResolver: WorkspaceResolverService,
  ) {}

  async switchWorkspace(
    session: Session,
    newWorkspaceId: string,
    actorId: string,
    requestId?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<Workspace> {
    const workspace = await this.workspaceResolver.resolveById(newWorkspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== session.userId) {
      throw new ForbiddenException('Workspace access denied');
    }

    if (workspace.deletedAt) {
      throw new ConflictException('Cannot switch to a deleted workspace');
    }

    if (workspace.status !== 'ACTIVE') {
      throw new ConflictException('Cannot switch to an inactive or archived workspace');
    }

    const start = Date.now();

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        activeWorkspaceId: workspace.id,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const duration = Date.now() - start;

    this.logger.log(
      `Workspace switched [Actor: ${actorId}] [Workspace: ${workspace.id}] [Session: ${session.id}] [Req: ${requestId || 'N/A'}] [Code: ${workspace.code}] [PublicId: ${workspace.publicId}] [IP: ${ip || 'N/A'}] [Agent: ${userAgent || 'N/A'}] [Duration: ${duration}ms]`,
    );

    return workspace;
  }
}
