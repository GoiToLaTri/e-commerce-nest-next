import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}
  async getProductStatistics(id: string) {
    if (!id || !ObjectId.isValid(id)) return;

    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, model: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    // 1. Tính rating trung bình và số lượng
    const ratingStats = await this.prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // 2. Thống kê hành vi người dùng theo action
    const rawInteractions = await this.prisma.userInteraction.groupBy({
      by: ['action'],
      where: { productId: id },
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
    });

    const interactions = rawInteractions.map((item) => ({
      action: item.action,
      count: item._count.action,
    }));

    const salesStats = (await this.prisma.orders.aggregateRaw({
      pipeline: [
        { $unwind: '$products' },
        {
          $match: {
            $expr: { $eq: [{ $toString: '$products.productId' }, id] },
          },
        },
        {
          $group: {
            _id: '$products.productId',
            totalSold: { $sum: '$products.quantity' },
          },
        },
        {
          $project: {
            _id: 0,
            id: { $toString: '$_id' },
            totalSold: 1,
          },
        },
      ],
    })) as unknown as { id: string; totalSold: number }[];

    const totalSold: number = salesStats[0]?.totalSold || 0;

    // Gộp tất cả vào kết quả
    return {
      ...product,
      averageRating: ratingStats._avg.rating || 0,
      ratingCount: ratingStats._count.rating,
      interactions,
      totalSold,
    };
  }
}
