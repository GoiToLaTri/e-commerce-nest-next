"use client";

import { ProductTable } from "@/components/ui";
import { useProducts } from "@/hooks/useProduct";

export default function ProductManage() {
  const page = 1;
  const limit = 1;
  const { data } = useProducts({ page, limit });

  return (
    <div>
      <div className="product-table">
        <ProductTable data={data || []} />
      </div>
    </div>
  );
}
