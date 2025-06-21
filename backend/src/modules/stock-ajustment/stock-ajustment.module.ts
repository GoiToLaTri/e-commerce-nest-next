import { Module } from '@nestjs/common';
import { StockAjustmentService } from './stock-ajustment.service';
import { StockAjustmentController } from './stock-ajustment.controller';

@Module({
  controllers: [StockAjustmentController],
  providers: [StockAjustmentService],
})
export class StockAjustmentModule {}
