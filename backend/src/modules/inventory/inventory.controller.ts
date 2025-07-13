import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'inventory', version: '1' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('search') search?: string,
  ) {
    // console.log({ page, sortField, sortOrder, limit, search });
    return this.inventoryService.findAll(
      +page || 1,
      +limit || 4,
      sortField,
      sortOrder,
      search,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Get(':productId')
  getInventory(@Param('productId') productId: string) {
    return this.inventoryService.getByProductId(productId);
  }
}
