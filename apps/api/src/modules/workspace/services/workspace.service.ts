import { Injectable, Logger } from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { WorkspaceValidatorService } from '../validators/workspace.validator';
import { WorkspacePolicyService } from './workspace.policy.service';
import { CodeGeneratorService } from '../../../core/services/code-generator.service';
import { WORKSPACE_CONSTANTS } from '../constants/workspace.constants';
import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceQueryDto } from '../dto';
import { WorkspaceStatus, Workspace, Prisma, ChannelType } from '@patterns/prisma';
import * as crypto from 'crypto';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceValidator: WorkspaceValidatorService,
    private readonly workspacePolicy: WorkspacePolicyService,
    private readonly codeGenerator: CodeGeneratorService,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    ownerId: string,
    actorId: string,
  ): Promise<Workspace> {
    const slug = await this.workspaceValidator.validateAndGenerateUniqueSlug(
      createWorkspaceDto.name,
    );
    const code = await this.codeGenerator.generateCode(
      WORKSPACE_CONSTANTS.CODE.SEQUENCE_NAME,
      WORKSPACE_CONSTANTS.CODE.PREFIX,
      WORKSPACE_CONSTANTS.CODE.PADDING,
    );
    const publicId = `wrk_${crypto.randomUUID().replace(/-/g, '')}`;

    const data: Prisma.WorkspaceCreateInput = {
      name: createWorkspaceDto.name,
      description: createWorkspaceDto.description || null,
      defaultChannel: createWorkspaceDto.defaultChannel || ChannelType.CUSTOM,
      slug,
      code,
      publicId,
      owner: { connect: { id: ownerId } },
      settings: (createWorkspaceDto.settings as any) || {},
      preferences: createWorkspaceDto.preferences || {},
      logoUrl: createWorkspaceDto.logoUrl || null,
      logoFilename: createWorkspaceDto.logoFilename || null,
      logoMimeType: createWorkspaceDto.logoMimeType || null,
      logoSize: createWorkspaceDto.logoSize || null,
    };

    const workspace = await this.workspaceRepository.create(data);

    this.logger.log({
      msg: 'Workspace Created',
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      ownerId: workspace.ownerId,
      actorId,
    });

    return workspace;
  }

  async findMany(
    query: WorkspaceQueryDto,
    ownerId?: string,
  ): Promise<{ data: Workspace[]; meta: any }> {
    const { page, limit, search, status, sort, order } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.workspaceRepository.findMany({ skip, take: limit, where, orderBy: { [sort]: order } }),
      this.workspaceRepository.count(where),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findById(id: string): Promise<Workspace> {
    return this.workspaceValidator.ensureWorkspaceExists(id);
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    actorId: string,
  ): Promise<Workspace> {
    const workspace = await this.workspaceValidator.ensureWorkspaceExists(id);

    const data: any = { ...updateWorkspaceDto };
    if (data.settings) data.settings = data.settings as any;
    if (data.preferences) data.preferences = data.preferences as any;

    const updated = await this.workspaceRepository.update(id, data);

    this.logger.log({
      msg: 'Workspace Updated',
      workspaceId: id,
      workspaceName: updated.name,
      actorId,
    });

    return updated;
  }

  async updateStatus(
    id: string,
    newStatus: WorkspaceStatus,
    ownerId: string,
    actorId: string,
  ): Promise<Workspace> {
    const workspace = await this.workspaceValidator.ensureWorkspaceExists(id);

    await this.workspacePolicy.validateStatusTransition(workspace.status, newStatus);

    if (newStatus === WorkspaceStatus.ARCHIVED || newStatus === WorkspaceStatus.INACTIVE) {
      await this.workspacePolicy.canArchive(id, ownerId);
    }

    const updated = await this.workspaceRepository.updateStatus(id, newStatus);

    this.logger.log({
      msg: `Workspace Status Changed to ${newStatus}`,
      workspaceId: id,
      workspaceName: updated.name,
      actorId,
    });

    return updated;
  }

  async softDelete(id: string, ownerId: string, actorId: string) {
    await this.workspaceValidator.ensureWorkspaceExists(id);
    await this.workspacePolicy.canDelete(id, ownerId);

    await this.workspaceRepository.softDelete(id);

    this.logger.log({
      msg: 'Workspace Deleted',
      workspaceId: id,
      actorId,
    });
  }

  async restore(id: string, actorId: string): Promise<Workspace> {
    // Note: Restore logic might need to fetch deleted entities differently if repository excludes them by default.
    // For now we assume a custom query or a raw update.
    const restored = await this.workspaceRepository.restore(id);

    this.logger.log({
      msg: 'Workspace Restored',
      workspaceId: id,
      actorId,
    });

    return restored;
  }
}
