import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceRepository } from '../../workspace/repositories/workspace.repository';
import { Workspace } from '@patterns/prisma';

@Injectable()
export class WorkspaceResolverService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async resolveById(id: string): Promise<Workspace | null> {
    return this.workspaceRepository.findById(id);
  }

  async resolveFromSession(sessionId: string): Promise<Workspace | null> {
    // Session contains activeWorkspaceId, but usually the factory gives us activeWorkspaceId from the session object
    // so we just lookup by id.
    throw new Error('Use resolveById instead');
  }

  async resolveDefault(userId: string): Promise<Workspace | null> {
    // Returns the first ACTIVE workspace owned by the user
    const workspaces = await this.workspaceRepository.findMany({
      where: { ownerId: userId, status: 'ACTIVE', deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 1,
    });
    return workspaces.length > 0 ? (workspaces[0] as Workspace) : null;
  }

  async resolveOwnedWorkspace(userId: string, workspaceId: string): Promise<Workspace | null> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.ownerId !== userId) {
      return null;
    }
    return workspace;
  }
}
