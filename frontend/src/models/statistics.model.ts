export interface ProductStatistics {
  id: string;
  model: string;
  averageRating: number;
  ratingCount: number;
  interactions: { action: string; count: number }[];
  totalSold: number;
}

export interface DashboardOverview {
  inventory: DashboardOverviewData;
  reviews: DashboardOverviewData;
  sales: DashboardOverviewData;
  views: DashboardOverviewData;
  user: DashboardOverviewData;
}

export interface DashboardOverviewData {
  current: number;
  previous: number;
  change: {
    percent: string;
    trend: "increase" | "decrease" | "no_change" | "new";
  };
}

export interface InventoryStatsResult {
  label: string;
  import: number;
  export: number;
  adjustment: number;
}

export interface InventoryFlow {
  currentInventoryStats: {
    totalImport: number;
    totalExport: number;
    totalAdjustment: number;
    totalInventory: number;
  }[];
  previousInventoryStats: {
    totalImport: number;
    totalExport: number;
    totalAdjustment: number;
    totalInventory: number;
  }[];
}

export interface LaptopBrandChartData {
  name: string;
  value: number;
  percentage: number;
}

export interface OrderStatusStats {
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  count: number;
  percentage: number;
  totalAmount: number;
}

export interface OrderStatusChartData {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface TopSpendingUser {
  totalSpent: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  id: string;
}
