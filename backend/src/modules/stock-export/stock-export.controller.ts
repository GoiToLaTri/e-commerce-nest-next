import { Controller } from '@nestjs/common';
import { StockExportService } from './stock-export.service';

@Controller('stock-export')
export class StockExportController {
  constructor(private readonly stockExportService: StockExportService) {}
}
