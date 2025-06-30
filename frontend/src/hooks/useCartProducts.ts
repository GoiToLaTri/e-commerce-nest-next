import { cartApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { ICart } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useCartProducts() {
  return useQuery<ICart>({
    queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
    queryFn: async () => {
      const res = await cartApi.getUserCart();
      return res.data;
    },
  });
}
