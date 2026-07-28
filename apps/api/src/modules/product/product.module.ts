import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductMapper } from './mappers/product.mapper';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductMapper],
  exports: [ProductService],
})
export class ProductModule {}
