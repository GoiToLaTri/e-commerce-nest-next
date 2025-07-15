import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryLogService } from '../inventory-log/inventory-log.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { StockExportDto } from './dto/stock-export.dto';

@Injectable()
export class StockExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly inventoryLogService: InventoryLogService,
  ) {}
  async create(stockExportDto: StockExportDto) {
    const { productId, quantity, reason, note, product } = stockExportDto;

    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) throw new BadRequestException('Inventory not found');

    if (inventory.quantity < quantity)
      throw new BadRequestException('Quantity invalid');

    await this.prisma.$transaction(async (tx) => {
      const exportRecord = await tx.stockExport.create({
        data: { productId, quantity, reason, note },
      });

      await tx.inventory.update({
        where: { productId },
        data: { quantity: { decrement: quantity } },
      });

      await this.inventoryLogService.transLogExport(tx, {
        productId,
        quantity_change: quantity,
        reference: exportRecord.id,
        product_name: product,
      });

      return exportRecord;
    });
  }
}
