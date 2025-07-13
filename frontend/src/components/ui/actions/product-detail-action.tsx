"use client";

import { Role } from "@/common/enums";
import { sonnerError, sonnerLoading } from "@/components/sonner/sonner";
import { useAddProductToCart } from "@/hooks/useAddProductToCart";
import { useAddUserInteraction } from "@/hooks/useAddUserInteraction";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";
import { useUserSession } from "@/hooks/useUserSession";
import { Button } from "antd";
import SkeletonButton from "antd/es/skeleton/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ProductDetailActionProps {
  productId: string;
}

export function ProductDetailAction({ productId }: ProductDetailActionProps) {
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const { data, isLoading } = useUserSession();
  const addToCartMutation = useAddProductToCart();
  const addUserInteractionMutation = useAddUserInteraction();
  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const router = useRouter();

  const haveSession = data && data.session_user.user.avatar;
  // const isAdmin = haveSession && data.session_user.user.roleId === Role.ADMIN;
  const isCustomer = haveSession && data.session_user.user.roleId === Role.USER;

  const handleAddToCart = async () => {
    setAddToCartLoading(true);
    sonnerLoading(
      addToCartMutation
        .mutateAsync({
          productId,
          quantity: 1,
        })
        .then(async (message) => {
          if (data) {
            await addUserInteractionMutation.mutateAsync({
              productId,
              userId: data.session_user.user_id,
              action: "ADDTOCART",
            });
          }
          setAddToCartLoading(false);
          return { message };
        })
        .catch((error) => {
          setAddToCartLoading(false);
          throw error.response.data.message || "Stock import failed!";
        })
    );
  };

  const handleBuyNow = async () => {
    try {
      setBuyNowLoading(true);
      await createCheckoutSessionMutation.mutateAsync({
        products: [{ productId, quantity: 1 }],
      });
      router.push("/checkout/buynow");
      setBuyNowLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      sonnerError(error.response.data.message || "Create checkout failed");
      setBuyNowLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <SkeletonButton />}
      {isLoading && <SkeletonButton />}
      {!isLoading && !haveSession && (
        <div>
          <Link href={"/auth/signin"}>
            <Button
              type="primary"
              size="large"
              className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 !py-"
            >
              Sign in to action
            </Button>
          </Link>
        </div>
      )}
      {!isLoading && isCustomer && (
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            size="large"
            loading={buyNowLoading}
            disabled={addToCartLoading}
            onClick={handleBuyNow}
            className={`!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 !py- ${
              addToCartLoading
                ? "!bg-gray-300 !text-gray-400 !border-gray-300 cursor-not-allowed"
                : ""
            }`}
          >
            Buy now
          </Button>
          <Button
            type="default"
            size="large"
            className={`!rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] !bg-transparent !border !border-[#924dff] !text-[#924dff] hover:!bg-[#f5f0ff] transition-colors duration-300 ${
              buyNowLoading
                ? "!bg-gray-300 !text-gray-400 !border-gray-300 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleAddToCart()}
            loading={addToCartLoading}
            disabled={buyNowLoading}
          >
            Add to cart
          </Button>
        </div>
      )}
    </div>
  );
}
