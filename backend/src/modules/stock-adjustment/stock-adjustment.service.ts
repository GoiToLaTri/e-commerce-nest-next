import { Injectable } from '@nestjs/common';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryLogService } from '../inventory-log/inventory-log.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class StockAdjustmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly inventoryLogService: InventoryLogService,
  ) {}
  async create(stockAdjustment: StockAdjustmentDto) {
    const { productId, actual_stock, system_stock, note } = stockAdjustment;
    await this.redis.del('inventory-*');

    await this.prisma.$transaction(async (tx) => {
      const adjustmentRecord = await tx.stockAdjustment.create({
        data: {
          productId,
          new_quantity: actual_stock,
          old_quantity: system_stock,
          reason: note,
        },
      });

      const delta = actual_stock - system_stock;

      await tx.inventory.update({
        where: { productId },
        data: { quantity: { increment: delta } },
      });

      await this.inventoryLogService.transLogAdjustment(tx, {
        productId,
        quantity_change: delta,
        reference: adjustmentRecord.id,
      });

      return adjustmentRecord;
    });
  }
}
