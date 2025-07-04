import { InventoryCard } from "@/components/ui";
import InventoryLogTable from "@/components/ui/tables/inventory-log-table";

export default async function InventoryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex gap-4">
      <div className="inventory-card w-[32%]">
        <InventoryCard id={id} />
      </div>
      <div className="inventory-log-table grow">
        <InventoryLogTable id={id} />
      </div>
    </div>
  );
}
