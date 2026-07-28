import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { SlugService } from '../../../core/services/slug.service';
import { Workspace } from '@patterns/prisma';

@Injectable()
export class WorkspaceValidatorService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly slugService: SlugService,
  ) {}

  async validateAndGenerateUniqueSlug(baseName: string): Promise<string> {
    const baseSlug = this.slugService.generate(baseName, 100);
    let slug = baseSlug;
    let counter = 1;

    while (await this.workspaceRepository.existsBySlug(slug)) {
      counter++;
      slug = this.slugService.appendSequence(baseSlug, counter);
    }

    return slug;
  }

  async ensureWorkspaceExists(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    return workspace;
  }
}
