import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('laptopBrand[]') laptopBrandRaw: string | string[],
    @Query('status[]') saleStatusRaw: string | string[],
    @Query('search') search: string,
  ) {
    const laptopBrand = Array.isArray(laptopBrandRaw)
      ? laptopBrandRaw
      : laptopBrandRaw
        ? [laptopBrandRaw]
        : undefined;

    const saleStatus = Array.isArray(saleStatusRaw)
      ? saleStatusRaw
      : saleStatusRaw
        ? [saleStatusRaw]
        : undefined;

    return this.productService.findAll(
      +page || 1,
      +limit || 4,
      sortField,
      sortOrder,
      laptopBrand,
      saleStatus,
      search,
    );
  }

  @Get('customer')
  findAllCustomer(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('laptopBrand[]') laptopBrandRaw: string | string[],
    @Query('cpuBrands[]') cpuBrandsRaw: string | string[],
    @Query('cpuSeries[]') cpuSeriesRaw: string | string[],
  ) {
    console.log({ cpuBrandsRaw, cpuSeriesRaw, laptopBrandRaw });
    const laptopBrand = Array.isArray(laptopBrandRaw)
      ? laptopBrandRaw
      : laptopBrandRaw
        ? [laptopBrandRaw]
        : undefined;

    const cpuBrands = Array.isArray(cpuBrandsRaw)
      ? cpuBrandsRaw
      : cpuBrandsRaw
        ? [cpuBrandsRaw]
        : undefined;

    const cpuSeries = Array.isArray(cpuSeriesRaw)
      ? cpuSeriesRaw
      : cpuSeriesRaw
        ? [cpuSeriesRaw]
        : undefined;

    return this.productService.findAllCustomer(
      +page || 1,
      +limit || 12,
      laptopBrand,
      cpuBrands,
      cpuSeries,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
