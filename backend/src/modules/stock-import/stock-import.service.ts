import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockImportDto } from './dto/stock-import.dto';
import { RedisService } from '../redis/redis.service';
import { InventoryLogService } from '../inventory-log/inventory-log.service';

@Injectable()
export class StockImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly inventoryLogService: InventoryLogService,
  ) {}
  async create(stockImportDto: StockImportDto) {
    const { productId, quantity, price, note, supplier } = stockImportDto;
    await this.redis.del('inventory-page-*');

    await this.prisma.$transaction(async (tx) => {
      const importRecord = await tx.stockImport.create({
        data: {
          productId,
          quantity,
          import_price: price,
          note,
          supplier_name: supplier,
        },
      });

      await tx.inventory.update({
        where: { productId },
        data: {
          quantity: { increment: quantity },
          cost: importRecord.import_price,
        },
      });

      await this.inventoryLogService.transLogImport(tx, {
        productId,
        quantity_change: quantity,
        reference: importRecord.id,
      });

      return importRecord;
    });
  }
}
