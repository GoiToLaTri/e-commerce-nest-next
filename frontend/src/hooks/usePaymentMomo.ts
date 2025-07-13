import { paymentApi } from "@/api-client/payment.api";
import { useMutation } from "@tanstack/react-query";

export function usePaymentMomo() {
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
