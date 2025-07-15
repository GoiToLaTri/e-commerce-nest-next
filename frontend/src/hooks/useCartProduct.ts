import { cartApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { CartProduct } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useCartProduct(id: string) {
  return useQuery<CartProduct>({
    queryKey: [queryKeys.GET_PRODUCT_IN_CART],
    queryFn: async () => {
      const res = await cartApi.getUserProductCart(id);
      return res.data;
    },
    gcTime: 0,
    staleTime: 0,
  });
}
