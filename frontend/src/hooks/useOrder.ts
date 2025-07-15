import { orderApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IOrder } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useOrder(id: string) {
  return useQuery<IOrder>({
    queryKey: [queryKeys.GET_ORDER, id],
    queryFn: async () => {
      const res = await orderApi.findOne(id);
      return res.data;
    },
  });
}
