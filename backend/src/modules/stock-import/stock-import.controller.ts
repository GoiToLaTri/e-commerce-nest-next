import { Body, Controller, Post } from '@nestjs/common';
import { StockImportService } from './stock-import.service';
import { StockImportDto } from './dto/stock-import.dto';

@Controller('stock-import')
export class StockImportController {
  constructor(private readonly stockImportService: StockImportService) {}
  @Post()
  create(@Body() stockImportDto: StockImportDto) {
    return this.stockImportService.create(stockImportDto);
  }
}
