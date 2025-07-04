import { StockAdjustmentForm } from "@/components/forms";
import Card from "@/components/ui/cards/card";
import React from "react";

export default async function StockAdjustment({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <div className="stock-import-form">
        <Card>
          <StockAdjustmentForm id={id} />
        </Card>
      </div>
    </div>
  );
}
