"use client";

import {
  InventoryFlows,
  InventoryTransactionOverview,
  LaptopbrandChart,
} from "@/components/charts";

export function DashboardMiddle() {
  //   console.log(data);

  return (
    <div>
      <div className="flex gap-5 mb-5">
        <div>
          <InventoryTransactionOverview />
        </div>
        <div>
          <InventoryFlows />
        </div>
      </div>
      <div className="mb-5">
        <LaptopbrandChart />
      </div>
    </div>
  );
}
