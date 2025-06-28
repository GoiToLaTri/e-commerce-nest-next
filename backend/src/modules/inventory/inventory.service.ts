import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { RedisService } from '../redis/redis.service';
import { appConfig } from '@/common/configs';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  transCreate(tx: Prisma.TransactionClient, productId: string) {
    return tx.inventory.create({
      data: { quantity: 0, product: { connect: { id: productId } } },
    });
  }

  getByProductId(productId: string) {
    return this.prisma.inventory.findUnique({
      where: { productId },
    });
  }

  async increaseStock(productId: string, quantity: number) {
    return this.prisma.inventory.update({
      where: { productId },
      data: { quantity: { increment: quantity } },
    });
  }

  async decreaseStock(productId: string, quantity: number) {
    return this.prisma.inventory.update({
      where: { productId },
      data: { quantity: { decrement: quantity } },
    });
  }

  async findOne(id: string) {
    const key = `inventory-${id}`;
    const cache: string | null = await this.redis.get(key);
    if (cache) return JSON.parse(cache) as { id: string };

    const fallbackData = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, model: true, thumbnail: true, price: true },
        },
      },
    });

    await this.redis.set(
      key,
      JSON.stringify(fallbackData),
      appConfig.REDIS_TTL_CACHE,
    );

    return fallbackData;
  }

  async findAll(page = 1, limit = 4, search?: string) {
    const skip = (page - 1) * limit;
    const key = `inventory-page-${page}`;

    if (!search) {
      const cache: string | null = await this.redis.get(key);
      if (cache) return JSON.parse(cache) as { id: string }[];
    }

    const inventoryList = await this.getInventoryList(skip, limit, search);
    const result = await this.appendImportExportStats(inventoryList);
    await this.redis.set(
      key,
      JSON.stringify(result),
      appConfig.REDIS_TTL_CACHE,
    );
    return result;
  }

  private async getInventoryList(skip: number, take: number, search?: string) {
    if (search) {
      const products = await this.prisma.product.findMany({
        where: { model: { contains: search, mode: 'insensitive' } },
        select: { id: true },
      });

      const productIds = products.map((p) => p.id);

      return this.prisma.inventory.findMany({
        where: { productId: { in: productIds } },
        skip,
        take,
        include: {
          product: {
            select: { id: true, thumbnail: true, model: true, price: true },
          },
        },
      });
    }

    return this.prisma.inventory.findMany({
      skip,
      take,
      include: {
        product: {
          select: { id: true, thumbnail: true, model: true, price: true },
        },
      },
    });
  }

  private async appendImportExportStats(inventories: { productId: string }[]) {
    const productIds = inventories.map((i) => i.productId);

    const importData = await this.prisma.stockImport.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds } },
      _sum: { quantity: true },
    });

    const exportData = await this.prisma.stockExport.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds } },
      _sum: { quantity: true },
    });

    return inventories.map((inv) => {
      const imported =
        importData.find((i) => i.productId === inv.productId)?._sum.quantity ||
        0;
      const exported =
        exportData.find((e) => e.productId === inv.productId)?._sum.quantity ||
        0;

      return {
        ...inv,
        total_imported: imported,
        total_exported: exported,
      };
    });
  }
}
