import { Injectable } from '@nestjs/common';
import { Prisma, Integration, IntegrationType } from '@patterns/prisma';
import { PrismaService } from '@core/database/prisma/prisma.service';

@Injectable()
export class IntegrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private isActive(workspaceId: string): Prisma.IntegrationWhereInput {
    return { workspaceId, deletedAt: null };
  }

  async findMany(
    workspaceId: string,
    where: Prisma.IntegrationWhereInput = {},
    skip?: number,
    take?: number,
    orderBy?: Prisma.IntegrationOrderByWithRelationInput,
  ): Promise<Integration[]> {
    const args: any = {
      where: {
        ...this.isActive(workspaceId),
        ...where,
      },
    };
    if (skip !== undefined) args.skip = skip;
    if (take !== undefined) args.take = take;
    if (orderBy !== undefined) args.orderBy = orderBy;

    return this.prisma.integration.findMany(args);
  }

  async count(workspaceId: string, where: Prisma.IntegrationWhereInput = {}): Promise<number> {
    return this.prisma.integration.count({
      where: {
        ...this.isActive(workspaceId),
        ...where,
      },
    });
  }

  async findById(workspaceId: string, id: string): Promise<Integration | null> {
    return this.prisma.integration.findFirst({
      where: { id, ...this.isActive(workspaceId) },
    });
  }

  async findByType(workspaceId: string, type: IntegrationType): Promise<Integration | null> {
    return this.prisma.integration.findFirst({
      where: { type, ...this.isActive(workspaceId) },
    });
  }

  async create(data: Prisma.IntegrationUncheckedCreateInput): Promise<Integration> {
    return this.prisma.integration.create({ data });
  }

  async update(id: string, data: Prisma.IntegrationUpdateInput): Promise<Integration> {
    return this.prisma.integration.update({
      where: { id },
      data: { ...data, version: { increment: 1 } },
    });
  }

  async softDelete(id: string): Promise<Integration> {
    return this.prisma.integration.update({
      where: { id },
      data: { deletedAt: new Date(), version: { increment: 1 } },
    });
  }
}
