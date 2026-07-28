import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../workspace-context/guards/workspace.guard';
import { WorkspaceContextInterceptor } from '../../workspace-context/interceptors/workspace-context.interceptor';
import { WorkspaceId } from '../../workspace-context/decorators/workspace-id.decorator';
import { ProductService } from '../services/product.service';
import { ProductMapper } from '../mappers/product.mapper';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@UseInterceptors(WorkspaceContextInterceptor)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productMapper: ProductMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(
    @WorkspaceId() workspaceId: string,
    @Body() dto: CreateProductDto,
  ): Promise<{ success: boolean; data: ProductResponseDto }> {
    const product = await this.productService.create(workspaceId, dto);
    return { success: true, data: this.productMapper.toResponseDto(product) };
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async findAll(
    @WorkspaceId() workspaceId: string,
  ): Promise<{ success: boolean; data: ProductResponseDto[] }> {
    const products = await this.productService.findAll(workspaceId);
    return { success: true, data: products.map((p) => this.productMapper.toResponseDto(p)) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  async findOne(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: ProductResponseDto }> {
    const product = await this.productService.findOne(workspaceId, id);
    return { success: true, data: this.productMapper.toResponseDto(product) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<{ success: boolean; data: ProductResponseDto }> {
    const product = await this.productService.update(workspaceId, id, dto);
    return { success: true, data: this.productMapper.toResponseDto(product) };
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a product' })
  async publish(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: ProductResponseDto }> {
    const product = await this.productService.publish(workspaceId, id);
    return { success: true, data: this.productMapper.toResponseDto(product) };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete/archive a product' })
  async remove(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.productService.remove(workspaceId, id);
    return { success: true, message: 'Product archived' };
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore an archived product' })
  async restore(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: ProductResponseDto }> {
    const product = await this.productService.restore(workspaceId, id);
    return { success: true, data: this.productMapper.toResponseDto(product) };
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Permanently delete a product' })
  async hardRemove(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.productService.hardRemove(workspaceId, id);
    return { success: true, message: 'Product permanently deleted' };
  }
}
