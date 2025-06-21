import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.findAll(+page || 1, +limit || 20, search);
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
