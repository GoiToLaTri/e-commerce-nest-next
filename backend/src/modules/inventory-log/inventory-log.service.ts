import { Injectable } from '@nestjs/common';
import { CreateInventoryLog } from './dto/create-inventory-log';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class InventoryLogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  logImport(createInventoryLog: CreateInventoryLog) {
    return this.prisma.inventoryLog.create({
      data: {
        productId: createInventoryLog.productId,
        change_type: 'import',
        quantity_change: Math.abs(createInventoryLog.quantity_change),
        reference: createInventoryLog.reference,
      },
    });
  }

  async transLogImport(
    tx: Prisma.TransactionClient,
    createInventoryLog: CreateInventoryLog,
  ) {
    return tx.inventoryLog.create({
      data: {
        productId: createInventoryLog.productId,
        change_type: 'import',
        quantity_change: Math.abs(createInventoryLog.quantity_change),
        reference: createInventoryLog.reference,
        created_by: 'admin',
        product_name: createInventoryLog.product_name,
        supplier_name: createInventoryLog.supplier_name,
      },
    });
  }

  async transLogExport(
    tx: Prisma.TransactionClient,
    createInventoryLog: CreateInventoryLog,
  ) {
    return tx.inventoryLog.create({
      data: {
        productId: createInventoryLog.productId,
        change_type: 'export',
        quantity_change: -Math.abs(createInventoryLog.quantity_change),
        reference: createInventoryLog.reference,
        created_by: 'admin',
        product_name: createInventoryLog.product_name,
        supplier_name: createInventoryLog.supplier_name,
      },
    });
  }

  async transLogAdjustment(
    tx: Prisma.TransactionClient,
    createInventoryLog: CreateInventoryLog,
  ) {
    return tx.inventoryLog.create({
      data: {
        productId: createInventoryLog.productId,
        change_type: 'adjustment',
        quantity_change: createInventoryLog.quantity_change,
        reference: createInventoryLog.reference,
        created_by: 'admin',
        product_name: createInventoryLog.product_name,
        supplier_name: createInventoryLog.supplier_name,
      },
    });
  }

  async findByProduct(
    productId: string,
    page = 1,
    limit = 8,
    sortField: string,
    sortOrder: string,
    changeType?: string[],
  ) {
    const skip = (page - 1) * limit;
    const where: { productId: string; change_type?: { in: string[] } } = {
      productId,
    };

    if (changeType && changeType.length > 0)
      where.change_type = { in: changeType };

    const orderBy =
      sortField && sortOrder
        ? { [sortField]: sortOrder as 'asc' | 'desc' }
        : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.inventoryLog.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.inventoryLog.count({
        where: { productId },
      }),
    ]);

    const setCacheData = {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return { ...setCacheData };
  }
}
