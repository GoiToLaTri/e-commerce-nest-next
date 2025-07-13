import { checkoutApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";

interface CheckoutSessionResponse {
  id: string;
  sessionId: string;
  userId: string;
  totalAmount: number;
  isPaid: boolean;
  isCancelled: boolean;
  products: {
    thumbnail: string;
    model: string;
    price: number;
    quantity: number;
  }[];
  paymentMethod: string | null;
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
  } | null;
  createdAt: string;
  expiredAt: string;
  message: string;
}

export function useGetCheckOutSession() {
  return useQuery<CheckoutSessionResponse>({
    queryKey: [queryKeys.GET_CHECKOUT_SESSION],
    queryFn: async () => {
      const res = await checkoutApi.getCheckoutSession();
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
