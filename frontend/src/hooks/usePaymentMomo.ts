import { paymentApi } from "@/api-client/payment.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function usePaymentMomo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await paymentApi.momoMethod();
      return res.data;
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      //   queryClient.invalidateQueries({
      //     queryKey: [queryKeys.USER_SESSION],
      //   });
    },
    onError: (error) => {
      console.error("Payment failed:", error);
    },
  });
}
