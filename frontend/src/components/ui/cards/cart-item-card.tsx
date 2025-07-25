"use client";

import { sonnerError, sonnerLoading } from "@/components/sonner/sonner";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";
import { useRemoveProductFromCart } from "@/hooks/useRemoveProductFromCart";
import { useUpdateQuantityProductCart } from "@/hooks/useUpdateQuantityProductCart";
import { CartProduct } from "@/models";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { Button, Image, InputNumber } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface CartItemCardProps {
  data: CartProduct;
}

export default function CartItemCard({ data }: CartItemCardProps) {
  // console.log(data);
  const [btnCheckoutLoading, setBtnCheckoutLoading] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(data.quantity);
  const updateQuantityMutation = useUpdateQuantityProductCart();
  const removeProductMutation = useRemoveProductFromCart();
  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const router = useRouter();

  // console.log(cartItem);

  const onChange = (value: number | null) => {
    if (!value) {
      setBtnDisabled(true);
      return;
    }

    setQuantity(value);
    setBtnDisabled(value === data.quantity);
  };

  const handleUpdateQuantity = async () => {
    if (btnDisabled) return;
    setBtnLoading(true);
    sonnerLoading(
      updateQuantityMutation
        .mutateAsync({
          cartItemId: data.id,
          quantity,
        })
        .then((message) => {
          setBtnLoading(false);
          setBtnDisabled(true);
          return { message };
        })
        .catch((error) => {
          throw error.response.data.message || "Update quantity failed!";
        })
    );
  };

  const handleRemove = async () => {
    sonnerLoading(
      removeProductMutation
        .mutateAsync({
          cartItemId: data.id,
        })
        .then((message) => ({ message }))
        .catch((error) => {
          throw error.response.data.message || "Remove product failed!";
        })
    );
  };

  const checkOutOne = async () => {
    try {
      setBtnCheckoutLoading(true);

      // if (!isLoading && cartItem) {
      await createCheckoutSessionMutation.mutateAsync({
        products: [{ productId: data.productId, quantity: data.quantity }],
      });
      router.push(`/checkout/cart/${data.id}`);
      // }
      setBtnCheckoutLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      sonnerError(error.response.data.message || "Create checkout failed");
      setBtnCheckoutLoading(false);
    }
  };

  return (
    <div className="cart-item w-[40rem] mb-4">
      <div className="transition-all duration-300 g-gradient-to-br from-white/10 to-white/5 backdrop-blur-0 border border-purple-200/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-[24px] flex items-start gap-4 px-6 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex justify-center mb-2">
            <Image
              src={data.product.thumbnail}
              alt={data.product.model}
              className="object-cover rounded w-40 h-40"
              preview={false}
              width={80}
              height={80}
            />
          </div>
          <div className="py-4 w-full">
            <div className="text-lg font-semibold mb-2">
              {data.product.model}
            </div>
            <div className="text-gray-500 mb-2">
              Price: {convertNumberToCurrency(data.priceAtAdded)}
            </div>
            <div className="flex justify-between items-end w-full">
              <div className="text-gray-500">
                Quantity:{" "}
                <InputNumber
                  min={1}
                  max={4}
                  value={quantity}
                  onChange={onChange}
                />{" "}
                <Button
                  disabled={btnDisabled}
                  loading={btnLoading}
                  className={`!font-medium leading-[1.6] !py-[0.75rem] transition-colors duration-300 ${
                    btnDisabled
                      ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
                      : "!bg-[#3DB8FF] hover:!bg-[#2E90FA] !text-white"
                  }`}
                  onClick={handleUpdateQuantity}
                >
                  Save
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  className="!bg-[#924dff] hover:!bg-[#7b3edc]!text-white !font-medium  leading-[1.6] !py-[0.75rem]  transition-colors duration-300"
                  onClick={checkOutOne}
                  loading={btnCheckoutLoading}
                >
                  Check out
                </Button>
                <Button
                  type="primary"
                  className="!bg-[#f87171] !font-medium !text-white leading-[1.6] !py-[0.75rem] hover:!bg-[#dc2626] transition-colors duration-300"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
