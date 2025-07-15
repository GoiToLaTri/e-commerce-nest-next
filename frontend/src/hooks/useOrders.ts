import { orderApi, QueryParams } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IOrder } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "./useProducts";

export interface OrderResponse {
  data: IOrder[];
  total: number;
  page: number;
  limit: number;
}

export function useOrders(
  query: { search?: string; status?: boolean } & QueryParams & PaginationParams
) {
  return useQuery<OrderResponse>({
    queryKey: [queryKeys.GET_ALL_ORDER, query],
    queryFn: async () => {
      const res = await orderApi.findAll({ ...query });
      return res.data;
    },
  });
}
