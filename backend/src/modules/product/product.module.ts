import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [CloudinaryModule, BrandModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
