import { checkoutSessionApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      products,
    }: {
      products: { productId: string; quantity: number }[];
    }) => {
      await checkoutSessionApi.create(products);
      return "Create session success";
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_CHECKOUT_SESSION],
      });
    },
    onError: (error) => {
      console.error("Create session failed:", error);
    },
  });
}
