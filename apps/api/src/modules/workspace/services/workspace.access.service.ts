import { Injectable, ForbiddenException } from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';

@Injectable()
export class WorkspaceAccessService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async validateWorkspaceAccess(userId: string, workspaceId: string): Promise<void> {
    const isOwner = await this.workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) {
      throw new ForbiddenException('You do not have access to this workspace.');
    }
    // Future: Check if user is a member/collaborator if not owner
  }

  async validateWorkspaceRestoreAccess(userId: string, workspaceId: string): Promise<void> {
    const isOwner = await this.workspaceRepository.isOwner(workspaceId, userId, true);
    if (!isOwner) {
      throw new ForbiddenException('You do not have access to this workspace.');
    }
  }
}
