"use client";

import React, { useEffect, useState } from "react";
import Card from "./card";
import { ICart } from "@/models";
import { Button, Descriptions } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { useClearCart } from "@/hooks/useClearCart";
import { sonnerLoading } from "@/components/sonner/sonner";
import { useRouter } from "next/navigation";

export interface CartInformationCardProps {
  data?: ICart;
  hasData?: boolean;
}

export default function CartInformationCard({
  data,
  hasData,
}: CartInformationCardProps) {
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!hasData) {
      setBtnDisabled(true);
      return;
    }
    setBtnDisabled(false);
  }, [hasData]);

  const clearCartMutation = useClearCart();
  const handleClearCart = () => {
    sonnerLoading(
      clearCartMutation
        .mutateAsync()
        .then((data) => {
          return { message: data.message };
        })
        .catch((error) => {
          throw error.response.data.message || "Clear cart failed!";
        })
    );
  };

  const checkOutAll = () => {
    router.push("/checkout/cart");
  };

  return (
    <div className="w-full cart-information">
      <Card>
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">
            Cart information
          </h2>
          {!hasData && <div>No data</div>}
          {data && (
            <div>
              <Descriptions column={1}>
                <DescriptionsItem label="Cart id">{data.id}</DescriptionsItem>
                <DescriptionsItem label="Total product">
                  {data.items.length}
                </DescriptionsItem>
                <DescriptionsItem label="Total item">
                  {data.items.reduce((total, item) => total + item.quantity, 0)}
                </DescriptionsItem>
                <DescriptionsItem label="Total price">
                  {convertNumberToCurrency(
                    data.items.reduce(
                      (total, item) =>
                        total + item.priceAtAdded * item.quantity,
                      0
                    )
                  )}
                </DescriptionsItem>
                <DescriptionsItem label="Latest update">
                  {new Date(data.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DescriptionsItem>
              </Descriptions>
              <div className="mt-4 flex gap-2">
                <Button
                  type="primary"
                  size="large"
                  className={`!rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] transition-colors duration-300 ${
                    btnDisabled
                      ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
                      : "!bg-[#924dff] hover:!bg-[#7b3edc] !text-white"
                  }`}
                  onClick={checkOutAll}
                >
                  Check out
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleClearCart}
                  disabled={btnDisabled}
                  className={`!rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem]  transition-colors duration-300 ${
                    btnDisabled
                      ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
                      : "!bg-[#f87171] hover:!bg-[#dc2626] !text-white"
                  }`}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
