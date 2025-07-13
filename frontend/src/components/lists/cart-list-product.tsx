"use client";

import { useCartProducts } from "@/hooks/useCartProducts";
import { Skeleton } from "antd";
import CartItemCard from "../ui/cards/cart-item-card";
import CartInformationCard from "../ui/cards/cart-information-card";

export default function CartListProduct() {
  const { data, isLoading, isError } = useCartProducts();
  const hasData = data && Array.isArray(data.items) && data.items.length > 0;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Shopping cart</h2>
      <div className="flex gap-8">
        <div className="w-[50%]">
          {isLoading && <Skeleton className="!w-full" />}
          {isError && (
            <div className="error-loading-cart">Error loading cart</div>
          )}
          {!isLoading && !hasData && (
            <div className="empty-cart">Cart is empty</div>
          )}
          {hasData && (
            <div>
              {data.items.map((item) => (
                <CartItemCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </div>
        <div className="w-[50%]">
          <CartInformationCard data={data} hasData={hasData} />
        </div>
      </div>
    </div>
  );
}
