"use client";

import { Role } from "@/common/enums";
import { sonnerLoading } from "@/components/sonner/sonner";
import { useAddProductToCart } from "@/hooks/useAddProductToCart";
import { useAddUserInteraction } from "@/hooks/useAddUserInteraction";
import { useUserSession } from "@/hooks/useUserSession";
import { Button } from "antd";
import SkeletonButton from "antd/es/skeleton/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ProductDetailActionProps {
  productId: string;
}

export function ProductDetailAction({ productId }: ProductDetailActionProps) {
  const { data, isLoading } = useUserSession();
  const addToCartMutation = useAddProductToCart();
  const addUserInteractionMutation = useAddUserInteraction();
  const router = useRouter();

  const haveSession = !isLoading && data && data.session_user.user.avatar;
  // const isAdmin = haveSession && data.session_user.user.roleId === Role.ADMIN;
  const isCustomer = haveSession && data.session_user.user.roleId === Role.USER;

  const handleAddToCart = async () => {
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
          return { message };
        })
        .catch((error) => {
          throw error.response.data.message || "Stock import failed!";
        })
    );
  };

  const handleBuyNow = () => {
    router.push("/checkout/buynow");
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <SkeletonButton />}
      {isLoading && <SkeletonButton />}
      {!haveSession && (
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
      {isCustomer && (
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            size="large"
            onClick={handleBuyNow}
            className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 !py-"
          >
            Buy now
          </Button>
          <Button
            type="default"
            size="large"
            className="!rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] !bg-transparent !border !border-[#924dff] !text-[#924dff] hover:!bg-[#f5f0ff] transition-colors duration-300"
            onClick={() => handleAddToCart()}
          >
            Add to cart
          </Button>
        </div>
      )}
    </div>
  );
}
