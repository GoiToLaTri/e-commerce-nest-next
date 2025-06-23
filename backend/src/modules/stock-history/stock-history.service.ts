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
  ) {
    const skip = (page - 1) * limit;
    const where: { change_type?: { in: string[] } } = {};
    const include: {
      Product: boolean | { select: any };
    } = { Product: { select: { model: true } } };
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

    const historiesWithReference = await Promise.all(
      histories.map(async (history) => {
        let referenceData: any = null;

        if (typeof history.reference === 'string') {
          switch (history.change_type) {
            case 'import':
              referenceData = await this.prisma.stockImport.findUnique({
                where: { id: history.reference },
              });
              break;
            case 'export':
              referenceData = await this.prisma.stockExport.findUnique({
                where: { id: history.reference },
              });
              break;
            case 'adjustment':
              referenceData = await this.prisma.stockAdjustment.findUnique({
                where: { id: history.reference },
              });
              break;
          }
        }

        return {
          ...history,
          reference: referenceData,
        };
      }),
    );

    return {
      data: historiesWithReference,
      total,
      page,
      limit,
    };
  }
}
