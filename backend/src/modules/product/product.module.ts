import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BrandModule } from '../brand/brand.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [CloudinaryModule, BrandModule, InventoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
