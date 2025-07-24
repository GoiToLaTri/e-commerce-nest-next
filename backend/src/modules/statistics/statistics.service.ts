import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ObjectId } from 'mongodb';
import { Role } from 'src/enums/role.enum';
import { InventoryStatsResult } from './interfaces/inventory-stats-result.interface';
import { endOfMonth, subMonths } from 'date-fns';
import { LaptopBrandChartData } from './interfaces/laptop-brand-chartdata.interface';
import { OrderStatusChartData } from './interfaces/order-stats-chartdata.interface';
import { OrderStatusStats } from './interfaces/order-status-stats.interface';
import { OrderStatus } from 'generated/prisma';

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

  async dashboardOverViewStatistics() {
    return this.overviewStatistics();
  }

  // Thống kê theo tuần (7 ngày gần nhất)
  async getWeeklyInventoryStats(): Promise<InventoryStatsResult[]> {
    const stats: InventoryStatsResult[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const logs = await this.prisma.inventoryLog.findMany({
        where: {
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const importTotal = logs
        .filter((log) => log.change_type === 'import')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const exportTotal = logs
        .filter((log) => log.change_type === 'export')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const adjustmentTotal = logs
        .filter((log) => log.change_type === 'adjustment')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      stats.push({
        name: date.toLocaleDateString('en-US', {
          // month: 'short',
          weekday: 'short',
          // day: 'numeric',
        }),
        import: importTotal,
        export: exportTotal,
        adjustment: adjustmentTotal,
      });
    }

    return stats;
  }

  // Thống kê theo tháng (4 tuần gần nhất)
  async getMonthlyInventoryStats(): Promise<InventoryStatsResult[]> {
    const stats: InventoryStatsResult[] = [];

    for (let i = 3; i >= 0; i--) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - i * 7);

      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const logs = await this.prisma.inventoryLog.findMany({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const importTotal = logs
        .filter((log) => log.change_type === 'import')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const exportTotal = logs
        .filter((log) => log.change_type === 'export')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const adjustmentTotal = logs
        .filter((log) => log.change_type === 'adjustment')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const weekNumber = 4 - i;
      stats.push({
        name: `Week ${weekNumber}`,
        import: importTotal,
        export: exportTotal,
        adjustment: adjustmentTotal,
      });
    }

    return stats;
  }

  // Thống kê theo 6 tháng (6 tháng gần nhất)
  async getSixMonthInventoryStats(): Promise<InventoryStatsResult[]> {
    const stats: InventoryStatsResult[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const logs = await this.prisma.inventoryLog.findMany({
        where: {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const importTotal = logs
        .filter((log) => log.change_type === 'import')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const exportTotal = logs
        .filter((log) => log.change_type === 'export')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const adjustmentTotal = logs
        .filter((log) => log.change_type === 'adjustment')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      stats.push({
        name: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        import: importTotal,
        export: exportTotal,
        adjustment: adjustmentTotal,
      });
    }

    return stats;
  }

  // Thống kê theo năm (12 tháng gần nhất)
  async getYearlyInventoryStats(): Promise<InventoryStatsResult[]> {
    const stats: InventoryStatsResult[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const logs = await this.prisma.inventoryLog.findMany({
        where: {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const importTotal = logs
        .filter((log) => log.change_type === 'import')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const exportTotal = logs
        .filter((log) => log.change_type === 'export')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      const adjustmentTotal = logs
        .filter((log) => log.change_type === 'adjustment')
        .reduce((sum, log) => sum + Math.abs(log.quantity_change), 0);

      stats.push({
        name: date.toLocaleDateString('en-US', {
          month: 'short',
          // year: 'numeric',
        }),
        import: importTotal,
        export: exportTotal,
        adjustment: adjustmentTotal,
      });
    }

    return stats;
  }

  // Hàm tổng hợp để gọi theo period
  async getInventoryStatsByPeriod(
    period: 'week' | 'month' | '6months' | 'year',
  ): Promise<InventoryStatsResult[]> {
    switch (period) {
      case 'week':
        return this.getWeeklyInventoryStats();
      case 'month':
        return this.getMonthlyInventoryStats();
      case '6months':
        return this.getSixMonthInventoryStats();
      case 'year':
        return this.getYearlyInventoryStats();
      default:
        throw new Error('Invalid period specified');
    }
  }

  async inventoryFlows() {
    const now = new Date();
    // const startOfLastMonth = startOfMonth(subMonths(now, 1)); // đầu tháng trước
    const endOfLastMonth = endOfMonth(subMonths(now, 1)); // cuối tháng trước

    const currentInventoryStats = await this.getInventoryStats();
    // console.log(await this.getInventoryStats());
    const previousInventoryStats = await this.getInventoryStats(endOfLastMonth);

    return { currentInventoryStats, previousInventoryStats };
  }

  async getLaptopBrandChartData(): Promise<LaptopBrandChartData[]> {
    const brands = await this.prisma.laptopBrand.findMany({
      include: {
        _count: {
          select: {
            product: true,
          },
        },
      },
      orderBy: {
        product: {
          _count: 'desc',
        },
      },
    });

    const totalProducts = brands.reduce(
      (sum, brand) => sum + brand._count.product,
      0,
    );

    return brands.map((brand) => ({
      name: brand.name,
      value: brand._count.product,
      percentage:
        totalProducts > 0
          ? Math.round((brand._count.product / totalProducts) * 100 * 100) / 100
          : 0,
    }));
  }

  async getOrderStatusStats(): Promise<OrderStatusStats[]> {
    const statusStats = await this.prisma.orders.groupBy({
      by: ['orderStatus'],
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    const totalOrders = await this.prisma.orders.count();

    return statusStats.map((stat) => ({
      status: stat.orderStatus,
      count: stat._count.id,
      percentage:
        totalOrders > 0
          ? Math.round((stat._count.id / totalOrders) * 100 * 100) / 100
          : 0,
      totalAmount: stat._sum.totalAmount || 0,
    }));
  }

  async getOrderStatusChartData(): Promise<OrderStatusChartData[]> {
    const stats = await this.getOrderStatusStats();

    const statusColors: Record<OrderStatus, string> = {
      PENDING: '#ffeaa7', // Orange
      PROCESSING: '#a29bfe', // Blue
      COMPLETED: '#55efc4', // Green
      CANCELLED: '#fd79a8', // Red
    };

    return stats.map((stat) => ({
      label: stat.status,
      value: stat.count,
      percentage: stat.percentage,
      color: statusColors[stat.status],
    }));
  }

  async getTopSpendingUsers(limit: number = 10) {
    const result = await this.prisma.orders.aggregateRaw({
      pipeline: [
        {
          $match: {
            paymentStatus: 'SUCCESS',
            userId: { $ne: null },
          },
        },
        {
          $group: {
            _id: '$userId',
            totalSpent: { $sum: '$totalAmount' },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'User',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            id: { $toString: '$_id' },
            _id: 0,
            totalSpent: 1,
            user: {
              id: { $toString: '$user._id' },
              name: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
              email: '$user.email',
              avatar: 1,
            },
          },
        },
      ],
    });

    return result;
  }

  private async overviewStatistics() {
    const now = new Date();

    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Chủ nhật tuần này
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);

    // ---- VIEW ----
    const currentView = await this.prisma.userInteraction.count({
      where: { action: 'VIEW' },
    });

    const previousView = await this.prisma.userInteraction.count({
      where: {
        action: 'VIEW',
        created_at: { lt: startOfCurrentWeek },
      },
    });

    // ---- REVIEW ----
    const currentReviews = await this.prisma.review.findMany({
      select: { rating: true },
    });

    const previousReviews = await this.prisma.review.findMany({
      where: { createdAt: { lt: startOfCurrentWeek } },
      select: { rating: true },
    });

    const currentReviewCount = currentReviews.length;
    const previousReviewCount = previousReviews.length;

    // ---- SOLD ----
    const currentSales = await this.prisma.orders.count();
    const previousSales = await this.prisma.orders.count({
      where: { createdAt: { lt: startOfCurrentWeek } },
    });

    // ---- INVENTORY ----
    const currentInventory = (
      (await this.prisma.inventory.aggregateRaw({
        pipeline: [
          { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
          { $project: { _id: 0, totalQuantity: 1 } },
        ],
      })) as unknown as { totalQuantity: number }[]
    )[0].totalQuantity;
    // console.log(await this.getInventoryStats());
    const inventoryStats = await this.getInventoryStats(startOfCurrentWeek);
    const previousInventory = inventoryStats[0].totalInventory;

    // ---- USER ----
    const currentUser = await this.prisma.user.count({
      where: { roleId: Role.USER },
    });
    const previousUser = await this.prisma.user.count({
      where: {
        roleId: Role.USER,
        created_at: { lt: startOfCurrentWeek },
      },
    });

    return {
      views: {
        current: currentView,
        previous: previousView,
        change: this.getPercent(currentView, previousView),
      },
      reviews: {
        current: currentReviewCount,
        previous: previousReviewCount,
        change: this.getPercent(currentReviewCount, previousReviewCount),
      },
      sales: {
        current: currentSales,
        previous: previousSales,
        change: this.getPercent(currentSales, previousSales),
      },
      inventory: {
        current: currentInventory,
        previous: previousInventory,
        change: this.getPercent(currentInventory, previousInventory),
      },
      user: {
        current: currentUser,
        previous: previousUser,
        change: this.getPercent(currentUser, previousUser),
      },
    };
  }

  private getPercent(current: number, previous: number) {
    if (previous === 0 && current === 0)
      return { percent: `0.00%`, trend: 'no_change' };

    if (previous === 0 && current !== 0)
      return { percent: `New`, trend: 'increase' };

    const percent = ((current - previous) / previous) * 100;
    const trend =
      percent > 0 ? 'increase' : percent < 0 ? 'decrease' : 'no_change';
    return { percent: `${percent.toFixed(2)}%`, trend };
  }

  private async getInventoryStats(
    startOfCurrentTime?: Date,
    // startOfLastTime?: Date,
  ) {
    const created_at = startOfCurrentTime
      ? { $lt: { $date: startOfCurrentTime } }
      : undefined;
    return (await this.prisma.inventoryLog.aggregateRaw({
      pipeline: [
        { $match: { created_at } },
        {
          $group: {
            _id: null,
            totalImport: {
              $sum: {
                $cond: [
                  { $eq: ['$change_type', 'import'] },
                  '$quantity_change',
                  0,
                ],
              },
            },
            totalExport: {
              $sum: {
                $cond: [
                  { $eq: ['$change_type', 'export'] },
                  { $abs: '$quantity_change' }, // dùng giá trị tuyệt đối
                  0,
                ],
              },
            },
            totalAdjustment: {
              $sum: {
                $cond: [
                  { $eq: ['$change_type', 'adjustment'] },
                  '$quantity_change',
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalImport: 1,
            totalExport: 1,
            totalAdjustment: 1,
            totalInventory: {
              $add: [
                { $subtract: ['$totalImport', '$totalExport'] },
                '$totalAdjustment',
              ],
            },
          },
        },
      ],
    })) as unknown as {
      totalImport: number;
      totalExport: number;
      totalAdjustment: number;
      totalInventory: number;
    }[];
  }
}
