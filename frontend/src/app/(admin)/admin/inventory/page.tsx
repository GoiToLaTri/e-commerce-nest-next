"use client";

import { InventoryTable } from "@/components/ui";
import { useInventories } from "@/hooks/useInventories";

export default function Inventory() {
  const page = 1;
  const limit = 4;
  const { data } = useInventories({ page, limit });

  return (
    <div>
      <div className="product-table">
        <InventoryTable data={data || []} />
      </div>
    </div>
  );
}
