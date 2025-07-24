"use client";

import OrderStatusChart from "@/components/charts/order-status-chart";
import TopSpendingUserTable from "@/components/ui/tables/top-spending-user-table";

export function DashboardBottom() {
  //   console.log(data);

  return (
    <div className="flex gap-5 mb-5">
      <div>
        <OrderStatusChart />
      </div>
      <div className="h-">
        <TopSpendingUserTable />
      </div>
    </div>
  );
}
