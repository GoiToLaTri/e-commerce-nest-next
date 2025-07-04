import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StockHistoryService } from './stock-history.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'stock-history', version: '1' })
export class StockHistoryController {
  constructor(private readonly stockHistoryService: StockHistoryService) {}

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('changeType') changeTypeRaw: string | string[],
    @Query('search') search: string,
  ) {
    const changeType = Array.isArray(changeTypeRaw)
      ? changeTypeRaw
      : changeTypeRaw
        ? [changeTypeRaw]
        : undefined;

    return this.stockHistoryService.findAll(
      +page,
      +limit,
      sortField,
      sortOrder,
      changeType,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockHistoryService.findOne(id);
  }
}
