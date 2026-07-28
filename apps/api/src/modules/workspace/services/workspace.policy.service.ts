import { Injectable, BadRequestException } from '@nestjs/common';
import { WorkspaceStatus } from '@patterns/prisma';
import { WorkspaceRepository } from '../repositories/workspace.repository';

@Injectable()
export class WorkspacePolicyService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async canArchive(workspaceId: string, ownerId: string): Promise<void> {
    await this.ensureMinimumActiveWorkspaces(ownerId);
  }

  async canDeactivate(workspaceId: string, ownerId: string): Promise<void> {
    await this.ensureMinimumActiveWorkspaces(ownerId);
  }

  async canDelete(workspaceId: string, ownerId: string): Promise<void> {
    await this.ensureMinimumActiveWorkspaces(ownerId);
  }

  async validateStatusTransition(
    currentStatus: WorkspaceStatus,
    newStatus: WorkspaceStatus,
  ): Promise<void> {
    if (currentStatus === newStatus) return;

    if (currentStatus === WorkspaceStatus.ARCHIVED && newStatus === WorkspaceStatus.ACTIVE) {
      throw new BadRequestException(
        'Cannot activate an archived workspace directly. Restore it first.',
      );
    }
  }

  private async ensureMinimumActiveWorkspaces(ownerId: string): Promise<void> {
    const activeCount = await this.workspaceRepository.countActiveByOwner(ownerId);
    // If they have only 1 active workspace, they can't delete/archive/deactivate it.
    if (activeCount <= 1) {
      throw new BadRequestException('You must have at least one active workspace.');
    }
  }
}
