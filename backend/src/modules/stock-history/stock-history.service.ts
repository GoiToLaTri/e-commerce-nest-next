import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockHistoryService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    page = 1,
    limit = 8,
    sortField: string,
    sortOrder: string,
    changeType?: string[],
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    if (search && search.trim()) {
      console.log(search);
      return await this.atlasSearch(
        search,
        page,
        limit,
        sortField,
        sortOrder,
        changeType,
      );
    }

    const where: { change_type?: { in: string[] } } = {};
    const include: {
      Product: boolean | { select: any };
    } = { Product: false };
    if (changeType && changeType.length > 0)
      where.change_type = { in: changeType };

    const orderBy =
      sortField && sortOrder
        ? { [sortField]: sortOrder as 'asc' | 'desc' }
        : undefined;

    const [histories, total] = await this.prisma.$transaction([
      this.prisma.inventoryLog.findMany({
        where,
        include,
        skip,
        orderBy,
        take: limit,
      }),
      this.prisma.inventoryLog.count({ where }),
    ]);

    // const historiesWithReference = await Promise.all(
    //   histories.map(async (history) => {
    //     let referenceData: any = null;

    //     if (typeof history.reference === 'string') {
    //       switch (history.change_type) {
    //         case 'import':
    //           referenceData = await this.prisma.stockImport.findUnique({
    //             where: { id: history.reference },
    //           });
    //           break;
    //         case 'export':
    //           referenceData = await this.prisma.stockExport.findUnique({
    //             where: { id: history.reference },
    //           });
    //           break;
    //         case 'adjustment':
    //           referenceData = await this.prisma.stockAdjustment.findUnique({
    //             where: { id: history.reference },
    //           });
    //           break;
    //       }
    //     }

    //     return {
    //       ...history,
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //       reference: referenceData,
    //     };
    //   }),
    // );

    return {
      data: histories,
      total,
      page,
      limit,
    };
  }

  private async atlasSearch(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    changeType?: string[],
  ) {
    const pipeline: Record<string, any>[] = [
      {
        $search: {
          index: 'inventory-log-search',
          text: {
            query: search,
            path: ['supplier_name', 'product_name'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1,
            },
          },
        },
      },
    ];

    // Thêm lọc changeType nếu có
    if (changeType && changeType.length > 0) {
      pipeline.push({
        $match: { change_type: { $in: changeType } },
      });
    }

    // Thêm addFields cho id + reference + product
    pipeline.push(
      {
        $addFields: {
          id: { $toString: '$_id' },
          productId: { $toString: '$productId' },
          reference: { $toString: '$reference' },
          created_at: { $dateToString: { date: '$created_at' } },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          change_type: 1,
          quantity_change: 1,
          product_name: 1,
          supplier_name: 1,
          reference: 1,
          created_by: 1,
          created_at: 1,
          productId: 1,
          Product: 1,
        },
      },
    );

    // Thêm sắp xếp
    const sortStage = {
      $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 },
    };
    pipeline.push(sortStage);

    // Thêm phân trang
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
    const data = await this.prisma.inventoryLog.aggregateRaw({ pipeline });
    const totalPipeline = [
      ...pipeline.filter((stage) => !('$skip' in stage || '$limit' in stage)),
    ];
    totalPipeline.push({ $count: 'total' });
    const totalResult = await this.prisma.inventoryLog.aggregateRaw({
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
    return {
      data,
      total,
      page,
      limit,
    };
  }

  update() {
    return this.prisma.inventoryLog.updateMany({
      where: {
        change_type: 'import',
      },
      data: {
        supplier_name: 'HP Supplier',
      },
    });
  }
}
