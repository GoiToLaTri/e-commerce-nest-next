import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StockImportService } from './stock-import.service';
import { StockImportDto } from './dto/stock-import.dto';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'stock-import', version: '1' })
export class StockImportController {
  constructor(private readonly stockImportService: StockImportService) {}
  @Post()
  create(@Body() stockImportDto: StockImportDto) {
    return this.stockImportService.create(stockImportDto);
  }
}
