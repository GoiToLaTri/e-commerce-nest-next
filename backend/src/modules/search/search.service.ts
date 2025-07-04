import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchProducts(search: string, page: number, limit: number) {
    return this.atlasSearch(search, page, limit);
  }

  private async atlasSearch(search: string = '', page: number, limit: number) {
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

    pipeline.push({
      $match: { status: true },
    });

    // Thêm addFields cho id + reference + product
    pipeline.push(
      {
        $addFields: {
          id: { $toString: '$_id' },
          created_at: { $dateToString: { date: '$created_at' } },
          updated_at: { $dateToString: { date: '$updated_at' } },
        },
      },
      {
        $lookup: {
          from: 'LaptopBrand', // tên collection
          localField: 'brand_id', // trường bên Product
          foreignField: '_id', // field bên LaptopBrand
          as: 'LaptopBrand',
        },
      },
      // lấy object thay vì array
      {
        $unwind: {
          path: '$LaptopBrand',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: [
          '_id',
          'brand_id',
          'description',
          'price',
          'processor_id',
          'videographics_id',
          'display_id',
          'memory_id',
          'storage_id',
          'adminId',
          'LaptopBrand.created_at',
          'LaptopBrand.updated_at',
          'LaptopBrand._id',
        ],
      },
    );

    // const sortStage = { $sort: { created_at: 1 } };
    // pipeline.push(sortStage);

    // Thêm phân trang
    // Validate pagination parameters
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.max(1, Math.min(100, limit || 10)); // Giới hạn tối đa 100

    // Thêm phân trang
    pipeline.push({ $skip: (safePage - 1) * safeLimit }, { $limit: safeLimit });
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

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
