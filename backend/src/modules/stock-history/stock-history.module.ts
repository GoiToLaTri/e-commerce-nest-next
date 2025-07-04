import { Module } from '@nestjs/common';
import { StockHistoryService } from './stock-history.service';
import { StockHistoryController } from './stock-history.controller';

@Module({
  controllers: [StockHistoryController],
  providers: [StockHistoryService],
})
export class StockHistoryModule {}
