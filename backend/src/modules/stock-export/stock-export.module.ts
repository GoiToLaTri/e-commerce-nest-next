import { Module } from '@nestjs/common';
import { StockExportService } from './stock-export.service';
import { StockExportController } from './stock-export.controller';
import { InventoryLogModule } from '../inventory-log/inventory-log.module';

@Module({
  imports: [InventoryLogModule],
  controllers: [StockExportController],
  providers: [StockExportService],
})
export class StockExportModule {}
