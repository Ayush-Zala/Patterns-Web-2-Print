import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Workspace, Prisma } from '@patterns/prisma';
import { BaseRepository } from '../../../core/database/repositories/base.repository';

@Injectable()
export class WorkspaceRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.prisma.workspace.findFirst({
      where: {
        id,
        ...this.isActive(),
      },
    });
  }

  async findByPublicId(publicId: string): Promise<Workspace | null> {
    return this.prisma.workspace.findFirst({
      where: {
        publicId,
        ...this.isActive(),
      },
    });
  }

  async findByCode(code: string): Promise<Workspace | null> {
    return this.prisma.workspace.findFirst({
      where: {
        code,
        ...this.isActive(),
      },
    });
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    return this.prisma.workspace.findFirst({
      where: {
        slug,
        ...this.isActive(),
      },
    });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.workspace.count({
      where: {
        slug,
        ...this.isActive(),
      },
    });
    return count > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.workspace.count({
      where: {
        code,
        ...this.isActive(),
      },
    });
    return count > 0;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput;
  }): Promise<Workspace[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.workspace.findMany({
      skip,
      take,
      where: {
        ...this.isActive(),
        ...where,
      },
      orderBy,
    } as any);
  }

  async count(where?: Prisma.WorkspaceWhereInput): Promise<number> {
    return this.prisma.workspace.count({
      where: {
        ...this.isActive(),
        ...where,
      },
    } as any);
  }

  async findOwned(ownerId: string, skip = 0, take = 20): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      where: {
        ownerId,
        ...this.isActive(),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByOwner(ownerId: string): Promise<number> {
    return this.prisma.workspace.count({
      where: {
        ownerId,
        ...this.isActive(),
      },
    });
  }

  async countActiveByOwner(ownerId: string): Promise<number> {
    return this.prisma.workspace.count({
      where: {
        ownerId,
        status: 'ACTIVE',
        ...this.isActive(),
      },
    });
  }

  async isOwner(workspaceId: string, userId: string, includeDeleted = false): Promise<boolean> {
    const count = await this.prisma.workspace.count({
      where: {
        id: workspaceId,
        ownerId: userId,
        ...(includeDeleted ? {} : this.isActive()),
      },
    });
    return count > 0;
  }

  async create(data: Prisma.WorkspaceCreateInput): Promise<Workspace> {
    return this.prisma.workspace.create({
      data,
    });
  }

  async update(id: string, data: Prisma.WorkspaceUpdateInput): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: { id },
      data: this.getSoftDeletePayload(),
    });
  }

  async restore(id: string): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: { id },
      data: this.getRestorePayload(),
    });
  }

  async updateStatus(id: string, status: any): Promise<Workspace> {
    return this.prisma.workspace.update({
      where: { id },
      data: { status },
    });
  }
}
