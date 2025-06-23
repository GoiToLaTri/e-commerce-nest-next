import { Module } from '@nestjs/common';

import { InventoryLogModule } from '../inventory-log/inventory-log.module';
import { StockAdjustmentController } from './stock-adjustment.controller';
import { StockAdjustmentService } from './stock-adjustment.service';

@Module({
  imports: [InventoryLogModule],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
