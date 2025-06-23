import { QueryParams } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "./useProducts";
import { stockHistoryApi } from "@/api-client/stock-history.api";

export function useStockHistory({
  page,
  limit,
  filters,
  sortField,
  sortOrder,
  search,
}: { search?: string } & QueryParams & PaginationParams) {
  return useQuery({
    queryKey: [
      queryKeys.GET_STOCK_HISTORY,
      { page, limit, sortField, sortOrder, filters, search },
    ],
    queryFn: async () => {
      const res = await stockHistoryApi.findAll({
        page,
        limit,
        sortField,
        sortOrder,
        filters,
        search,
      });
      return res.data;
    },
  });
}
