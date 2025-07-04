import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryLogService } from './inventory-log.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'inventory-log', version: '1' })
export class InventoryLogController {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  @Get(':productId')
  findByProduct(
    @Param('productId') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('changeType') changeTypeRaw: string | string[],
  ) {
    const changeType = Array.isArray(changeTypeRaw)
      ? changeTypeRaw
      : changeTypeRaw
        ? [changeTypeRaw]
        : undefined;

    return this.inventoryLogService.findByProduct(
      id,
      +page,
      +limit,
      sortField,
      sortOrder,
      changeType,
    );
  }
}
