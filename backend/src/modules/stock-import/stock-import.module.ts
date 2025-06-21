import { Module } from '@nestjs/common';
import { StockImportService } from './stock-import.service';
import { StockImportController } from './stock-import.controller';
import { InventoryLogModule } from '../inventory-log/inventory-log.module';

@Module({
  imports: [InventoryLogModule],
  controllers: [StockImportController],
  providers: [StockImportService],
})
export class StockImportModule {}
