import { orderApi, QueryParams } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "./useProducts";

export interface PurchasedResponse {
  data: {
    id: string;
    thumbnail: string;
    price: number;
    model: string;
    shippingInfo: {
      delivery: "shipping" | "pickup";
      phone: string;
      fullName: string;
      note: string;
      address: string;
      shippingFee: number;
    };
  }[];
  total: number;
  page: number;
  limit: number;
}

export function useClientPurchased(
  query: { search?: string; status?: boolean } & QueryParams & PaginationParams
) {
  return useQuery<PurchasedResponse>({
    queryKey: [queryKeys.GET_ALL_CLIENT_PURCHASED, query],
    queryFn: async () => {
      const res = await orderApi.clientPruchased({ ...query });
      return res.data;
    },
  });
}
