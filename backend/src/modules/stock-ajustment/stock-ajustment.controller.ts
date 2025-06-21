import { Controller } from '@nestjs/common';
import { StockAjustmentService } from './stock-ajustment.service';

@Controller('stock-ajustment')
export class StockAjustmentController {
  constructor(private readonly stockAjustmentService: StockAjustmentService) {}
}
