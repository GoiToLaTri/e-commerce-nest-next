import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('products')
  async searchProducts(
    @Query('q') search: string,
    page: number = 1,
    limit = 10,
  ) {
    // console.log(search);
    return this.searchService.searchProducts(search, +page, +limit);
  }
}
