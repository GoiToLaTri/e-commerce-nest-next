import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get('product/:id')
  getProductStatistics(@Param('id') id: string) {
    return this.statisticsService.getProductStatistics(id);
  }

  @Get('overview')
  dashboardOverViewStatistics() {
    return this.statisticsService.dashboardOverViewStatistics();
  }

  @Get('inventory-stats-by-period')
  getInventoryStatsByPeriod(
    @Query('period') period: 'week' | 'month' | '6months' | 'year',
  ) {
    return this.statisticsService.getInventoryStatsByPeriod(period);
  }

  @Get('inventory-flows')
  inventoryFlows() {
    return this.statisticsService.inventoryFlows();
  }

  @Get('laptop-brand-chart')
  getLaptopBrandChartData() {
    return this.statisticsService.getLaptopBrandChartData();
  }

  @Get('order-status-chart')
  getOrderStatusChartData() {
    return this.statisticsService.getOrderStatusChartData();
  }

  @Get('top-spending-user')
  getTopSpendingUsers() {
    return this.statisticsService.getTopSpendingUsers();
  }
}
