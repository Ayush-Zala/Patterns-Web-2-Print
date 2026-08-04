import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { IntegrationRepository } from '../repositories/integration.repository';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
import { IntegrationQueryDto } from '../dto/integration-query.dto';
import { AuditPublisher } from '@modules/audit/services/audit.publisher';
import { Integration, Prisma } from '@patterns/prisma';

import { NativeWebsiteService } from './native-website.service';
import { WordPressService } from './wordpress.service';
import { ShopifyService } from './shopify.service';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly repository: IntegrationRepository,
    private readonly auditPublisher: AuditPublisher,
    private readonly nativeWebsiteService: NativeWebsiteService,
    private readonly wordPressService: WordPressService,
    private readonly shopifyService: ShopifyService,
  ) {
    this.registerStrategy('NATIVE_WEBSITE', nativeWebsiteService);
    this.registerStrategy('WORDPRESS', wordPressService);
    this.registerStrategy('SHOPIFY', shopifyService);
  }

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

  async connectShopifyOAuth(
    workspaceId: string,
    userId: string,
    shop: string,
    redirectUri: string,
  ): Promise<{ redirectUrl: string }> {
    // Check if Shopify integration exists for this workspace
    let integration = await this.repository.findByType(workspaceId, 'SHOPIFY');
    if (!integration) {
      integration = await this.create(workspaceId, userId, {
        type: 'SHOPIFY',
        displayName: 'Shopify Integration',
      });
    }

    // Generate a secure connection token (UUID is fine for server-to-server validation)
    const crypto = require('crypto');
    const token = crypto.randomUUID();

    // Construct the redirect URL with the token
    const url = new URL(redirectUri);
    url.searchParams.set('token', token);
    url.searchParams.set('shop', shop);
    url.searchParams.set('workspaceId', workspaceId);
    url.searchParams.set('integrationId', integration.id);

    return { redirectUrl: url.toString() };
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

  // --- Strategy Registry Methods --- //

  // Injected via setters to avoid circular dependencies
  private strategies = new Map<string, any>();

  registerStrategy(type: string, service: any) {
    this.strategies.set(type, service);
  }

  private getStrategy(type: string) {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new BadRequestException(`Operation not supported for integration type ${type}`);
    }
    return strategy;
  }

  async connectIntegration(workspaceId: string, id: string, userId: string) {
    const integration = await this.findOne(workspaceId, id);
    return this.getStrategy(integration.type).connect(workspaceId, id, userId);
  }

  async rotateIntegrationSecret(workspaceId: string, id: string, userId: string) {
    const integration = await this.findOne(workspaceId, id);
    return this.getStrategy(integration.type).rotateSecret(workspaceId, id, userId);
  }

  async getIntegrationStatus(workspaceId: string, id: string) {
    const integration = await this.findOne(workspaceId, id);
    return this.getStrategy(integration.type).getStatus(workspaceId, id);
  }

  async disconnectIntegration(workspaceId: string, id: string, userId: string) {
    const integration = await this.findOne(workspaceId, id);
    if (!this.strategies.has(integration.type)) {
      throw new BadRequestException(
        `Disconnect not supported for integration type ${integration.type}`,
      );
    }

    const updated = await this.update(workspaceId, id, userId, {
      connectionStatus: 'DISCONNECTED',
    } as any);

    // If specific disconnect logic is needed in strategy, we can call it here.
    // For now, updating the status and emitting an audit event based on integration type.
    const typeUpper = integration.type.toUpperCase();
    this.auditPublisher.publish({
      userId,
      workspaceId,
      action: `${typeUpper}_DISCONNECTED`,
      resource: 'Integration',
      resourceId: id,
      metadata: { integrationId: id, type: integration.type },
    });

    return updated;
  }
}
