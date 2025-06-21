import { Module } from '@nestjs/common';
import { StockExportService } from './stock-export.service';
import { StockExportController } from './stock-export.controller';

@Module({
  controllers: [StockExportController],
  providers: [StockExportService],
})
export class StockExportModule {}
