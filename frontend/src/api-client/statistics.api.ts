import axiosClient from "./axios-client";

export const statisticsApi = {
  getProductStatistics: (id: string) =>
    axiosClient.get(`proxy/statistics/product/${id}`),
  dashboardOverview: () => axiosClient.get(`proxy/statistics/overview`),
  getInventoryStatsByPeriod: (period: "week" | "month" | "6months" | "year") =>
    axiosClient.get(`proxy/statistics/inventory-stats-by-period`, {
      params: { period },
    }),
  getInventoryFlows: () => axiosClient.get(`proxy/statistics/inventory-flows`),
  getLaptopBrandChartData: () =>
    axiosClient.get(`proxy/statistics/laptop-brand-chart`),
  getOrderStatusChartData: () =>
    axiosClient.get(`proxy/statistics/order-status-chart`),
  getTopSpendingUsers: () =>
    axiosClient.get(`proxy/statistics/top-spending-user`),
};
