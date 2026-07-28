import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IntegrationRepository } from '../repositories/integration.repository';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
import { IntegrationQueryDto } from '../dto/integration-query.dto';
import { AuditPublisher } from '@modules/audit/services/audit.publisher';
import { Integration, Prisma } from '@patterns/prisma';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly repository: IntegrationRepository,
    private readonly auditPublisher: AuditPublisher,
  ) {}

  async create(
    workspaceId: string,
    userId: string,
    data: CreateIntegrationDto,
  ): Promise<Integration> {
    const existing = await this.repository.findByType(workspaceId, data.type);
    if (existing) {
      throw new ConflictException(
        `An integration of type ${data.type} already exists for this workspace`,
      );
    }

    const integration = await this.repository.create({
      workspaceId,
      type: data.type,
      displayName: data.displayName,
      configuration: {},
    });

    this.auditPublisher.publish({
      userId,
      workspaceId,
      action: 'CREATE_INTEGRATION',
      resource: 'Integration',
      resourceId: integration.id,
      metadata: { type: data.type, displayName: data.displayName },
    });

    return integration;
  }

  async findMany(
    workspaceId: string,
    query: IntegrationQueryDto,
  ): Promise<{ data: Integration[]; total: number }> {
    const where: Prisma.IntegrationWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.displayName = { contains: query.search, mode: 'insensitive' };
    }

    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.findMany(workspaceId, where, skip, limit, { createdAt: 'desc' }),
      this.repository.count(workspaceId, where),
    ]);

    return { data, total };
  }

  async findOne(workspaceId: string, id: string): Promise<Integration> {
    const integration = await this.repository.findById(workspaceId, id);
    if (!integration) {
      throw new NotFoundException('Integration not found');
    }
    return integration;
  }

  async update(
    workspaceId: string,
    id: string,
    userId: string,
    data: UpdateIntegrationDto,
  ): Promise<Integration> {
    await this.findOne(workspaceId, id); // Ensure exists

    const updateData: Prisma.IntegrationUpdateInput = {};
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.status !== undefined) updateData.status = data.status;

    const integration = await this.repository.update(id, updateData);

    this.auditPublisher.publish({
      userId,
      workspaceId,
      action: 'UPDATE_INTEGRATION',
      resource: 'Integration',
      resourceId: id,
      metadata: { updates: data },
    });

    return integration;
  }

  async softDelete(workspaceId: string, id: string, userId: string): Promise<void> {
    await this.findOne(workspaceId, id); // Ensure exists

    await this.repository.softDelete(id);

    this.auditPublisher.publish({
      userId,
      workspaceId,
      action: 'DELETE_INTEGRATION',
      resource: 'Integration',
      resourceId: id,
    });
  }
}
