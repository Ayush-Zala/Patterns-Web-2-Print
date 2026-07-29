import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product, ProductStatus } from '@patterns/prisma';
import { EVENT_NAMES, DomainEvent } from '@patterns/events';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(workspaceId: string, dto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        workspaceId,
        title: dto.title,
        description: dto.description ?? null,
        price: dto.price,
        imageUrl: dto.imageUrl ?? null,
        status: ProductStatus.DRAFT,
      },
    });

    const event: DomainEvent<Product> = {
      id: crypto.randomUUID(),
      type: EVENT_NAMES.PRODUCT_CREATED,
      payload: product,
      meta: {
        timestamp: new Date().toISOString(),
        source: 'api.product',
        workspaceId,
      },
    };

    this.eventEmitter.emit(event.type, event);

    return product;
  }

  async findAll(workspaceId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(workspaceId: string, id: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id, workspaceId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(workspaceId: string, id: string, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(workspaceId, id);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async publish(workspaceId: string, id: string): Promise<Product> {
    await this.findOne(workspaceId, id);
    return this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.PUBLISHED },
    });
  }

  async remove(workspaceId: string, id: string): Promise<void> {
    await this.findOne(workspaceId, id);
    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED, deletedAt: new Date() },
    });
  }

  async restore(workspaceId: string, id: string): Promise<Product> {
    await this.findOne(workspaceId, id);
    return this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.DRAFT, deletedAt: null },
    });
  }

  async hardRemove(workspaceId: string, id: string): Promise<void> {
    await this.findOne(workspaceId, id);
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
