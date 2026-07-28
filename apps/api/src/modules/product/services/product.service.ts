import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product, ProductStatus } from '@patterns/prisma';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        workspaceId,
        title: dto.title,
        description: dto.description ?? null,
        price: dto.price,
        imageUrl: dto.imageUrl ?? null,
        status: ProductStatus.DRAFT,
      },
    });
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
