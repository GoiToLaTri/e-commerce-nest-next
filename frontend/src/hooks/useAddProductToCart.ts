import { cartApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { AddToCartPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddProductToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addToCartPayload: AddToCartPayload) => {
      await cartApi.addToCart(addToCartPayload);
      return "Add to cart success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PRODUCTS_IN_CART],
      });
      console.log("Add to cart success");
    },
    onError: (error) => {
      console.error("Add to cart failed:", error);
    },
  });
}
