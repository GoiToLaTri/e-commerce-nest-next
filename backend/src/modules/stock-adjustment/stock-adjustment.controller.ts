import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'stock-adjustment', version: '1' })
export class StockAdjustmentController {
  constructor(
    private readonly stockAdjustmentService: StockAdjustmentService,
  ) {}
  @Post()
  create(@Body() stockAdjustmentDto: StockAdjustmentDto) {
    // console.log(stockAdjustmentDto);
    return this.stockAdjustmentService.create(stockAdjustmentDto);
  }
}
