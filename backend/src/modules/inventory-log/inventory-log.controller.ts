import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryLogService } from './inventory-log.service';

@Controller('inventory-log')
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
