import { cartApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateQuantityProductCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => {
      await cartApi.updateQuantity(cartItemId, quantity);
      return "Update quantity success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
      // console.log("Update quantity success");
    },
    onError: (error) => {
      console.error("Update quantity failed:", error);
    },
  });
}
