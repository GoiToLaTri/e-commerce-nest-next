import { OrderClientTable } from "@/components/ui";

export default function OrderPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Orders</h2>
      <div className="product-table">
        <OrderClientTable />
      </div>
    </div>
  );
}
