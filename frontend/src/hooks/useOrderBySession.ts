import { orderApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IOrder } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useOrderBySession(sessionId: string) {
  return useQuery<IOrder>({
    queryKey: [queryKeys.GET_ORDER_BY_SESSIONID, sessionId],
    queryFn: async () => {
      const res = await orderApi.findBySessionId(sessionId);
      return res.data;
    },
  });
}
