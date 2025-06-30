"use client";

import { useCartProducts } from "@/hooks/useCartProducts";
import { Skeleton } from "antd";
import CartItemCard from "../ui/cards/cart-item-card";

export default function CartListProduct() {
  const { data, isLoading, isError } = useCartProducts();
  console.log({ data, isLoading, isError });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Shopping cart</h2>
      {isLoading && <Skeleton className="!w-full" />}
      {isError && <div>Error loading cart</div>}
      {!isLoading && data?.items.length === 0 && <div>Cart is empty</div>}
      {!isLoading && data && (
        <div>
          {data.items.map((item) => (
            <CartItemCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}
