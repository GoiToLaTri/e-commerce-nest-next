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

  async findAll(
    page = 1,
    limit = 4,
    sortField: string,
    sortOrder: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const inventoryList = await this.getInventoryList(
      skip,
      limit,
      sortField,
      sortOrder,
      search,
    );

    const result = await this.appendImportExportStats(inventoryList.data);

    return { data: result, total: inventoryList.total, page, limit };
  }

  private async getInventoryList(
    skip: number,
    take: number,
    sortField: string,
    sortOrder: string,
    search?: string,
  ) {
    const orderBy =
      sortField && sortOrder
        ? { [sortField]: sortOrder as 'asc' | 'desc' }
        : undefined;

    if (search) {
      const { data: products } = await this.atlasSearch(
        search,
        skip,
        take,
        sortField,
        sortOrder,
      );

      const productIds: string[] =
        (products as unknown as { id: string }[]).map((p) => p.id) || [];

      const [inventoryList, total] = await this.prisma.$transaction([
        this.prisma.inventory.findMany({
          where: { productId: { in: productIds } },
          skip,
          take,
          orderBy,
          include: {
            product: {
              select: { id: true, thumbnail: true, model: true, price: true },
            },
          },
        }),
        this.prisma.inventory.count({
          where: { productId: { in: productIds } },
        }),
      ]);
      return { data: inventoryList, total };
    }

    const [inventoryList, total] = await this.prisma.$transaction([
      this.prisma.inventory.findMany({
        skip,
        take,
        orderBy,
        include: {
          product: {
            select: { id: true, thumbnail: true, model: true, price: true },
          },
        },
      }),
      this.prisma.inventory.count(),
    ]);
    return { data: inventoryList, total };
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

  private async atlasSearch(
    search: string,
    skip: number,
    take: number,
    sortField?: string,
    sortOrder?: string,
  ) {
    console.log(search);
    const pipeline: Record<string, any>[] = [
      {
        $search: {
          index: 'product_search',
          text: {
            query: search,
            path: 'model',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1,
            },
          },
        },
      },
    ];

    // Thêm addFields cho id + reference + product
    pipeline.push({ $addFields: { id: { $toString: '$_id' } } });

    // Thêm sắp xếp
    const defaultSortField = 'quantity'; // Hoặc field mặc định khác
    const validSortFields = ['quantity', 'cost']; // Danh sách các field hợp lệ

    // Validate sortField
    const safeSortField =
      sortField && validSortFields.includes(sortField)
        ? sortField
        : defaultSortField;
    const safeSortOrder = sortOrder === 'desc' ? -1 : 1;
    const sortStage = { $sort: { [safeSortField]: safeSortOrder } };
    pipeline.push(sortStage);

    // Thêm phân trang
    // Validate pagination parameters
    // const safePage = Math.max(1, page || 1);
    // Giới hạn tối đa 100
    // const safeLimit = Math.max(1, Math.min(100, limit || 10));

    // Thêm phân trang
    // pipeline.push({ $skip: (safePage - 1) * safeLimit }, { $limit: safeLimit });
    pipeline.push({ $skip: skip }, { $limit: take });
    const data = await this.prisma.product.aggregateRaw({ pipeline });
    const totalPipeline = [
      ...pipeline.filter((stage) => !('$skip' in stage || '$limit' in stage)),
    ];
    totalPipeline.push({ $count: 'total' });
    const totalResult = await this.prisma.product.aggregateRaw({
      pipeline: totalPipeline,
    });
    let total = 0;
    if (
      Array.isArray(totalResult) &&
      totalResult.length > 0 &&
      typeof totalResult[0] === 'object' &&
      totalResult[0] !== null &&
      'total' in totalResult[0]
    ) {
      total = Number((totalResult[0] as { total: number }).total) || 0;
    }
    // Cuối cùng gọi aggregateRaw

    return { data, total };
  }
}
