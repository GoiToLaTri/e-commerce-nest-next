import { cartApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveProductFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cartItemId }: { cartItemId: string }) => {
      await cartApi.deleteProductFromCart(cartItemId);
      return "Remove product from cart success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
      // console.log("Remove product from cart success");
    },
    onError: (error) => {
      console.error("Remove product from cart failed:", error);
    },
  });
}
