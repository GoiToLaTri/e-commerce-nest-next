import { checkoutSessionApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCheckoutSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      shippingInfo: {
        fullName: string;
        address: string[];
        phone: string;
        delivery: string;
        shippingfee: number;
      };
      paymentMethod: string;
      sessionId: string;
    }) => {
      const { sessionId, ...rest } = payload;
      await checkoutSessionApi.update(rest, sessionId);
      return "Update session success";
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_CHECKOUT_SESSION],
      });
    },
    onError: (error) => {
      console.error("Update session failed:", error);
    },
  });
}
