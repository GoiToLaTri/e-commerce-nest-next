import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";
import { stockHistoryApi } from "@/api-client/stock-history.api";

export function useStockHistoryDetail({ id }: { id: string }) {
  return useQuery({
    queryKey: [queryKeys.GET_STOCK_HISTORY_DETAIL, id],
    queryFn: async () => {
      const res = await stockHistoryApi.findOne({ id });
      return res.data;
    },
  });
}
