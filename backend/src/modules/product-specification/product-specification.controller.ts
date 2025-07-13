import { Controller, Get } from '@nestjs/common';
import { ProductSpecificationService } from './product-specification.service';

@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}
  @Get('cpu')
  async findManyCpu() {
    // console.log('calling findManyCpu');
    return this.productSpecificationService.findManyCpu();
  }
  @Get('ram')
  async findManyRam() {
    return this.productSpecificationService.findManyRam();
  }

  @Get('storage')
  async findManyStorage() {
    return this.productSpecificationService.findManyStorage();
  }

  @Get('gpu')
  async findManyGpu() {
    return this.productSpecificationService.findManyGpu();
  }
}
