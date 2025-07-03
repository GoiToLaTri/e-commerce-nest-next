import { cartApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await cartApi.clearCart();
      return res.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
    },
    onError: (error) => {
      console.error("Singin failed:", error);
    },
  });
}
