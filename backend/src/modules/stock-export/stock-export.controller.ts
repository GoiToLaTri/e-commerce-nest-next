import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StockExportService } from './stock-export.service';
import { StockExportDto } from './dto/stock-export.dto';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'stock-export', version: '1' })
export class StockExportController {
  constructor(private readonly stockExportService: StockExportService) {}
  @Post()
  create(@Body() stockExportDto: StockExportDto) {
    return this.stockExportService.create(stockExportDto);
  }
}
