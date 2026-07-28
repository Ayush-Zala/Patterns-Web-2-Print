import { Injectable } from '@nestjs/common';
import { Product } from '@patterns/prisma';
import { ProductResponseDto } from '../dto/product-response.dto';

@Injectable()
export class ProductMapper {
  toResponseDto(entity: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = entity.id;
    dto.workspaceId = entity.workspaceId;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.imageUrl = entity.imageUrl;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
