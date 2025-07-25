import { inventoryLogApi, QueryParams } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IInventoryLog } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "./useProducts";

export function useProductInventoryLog({
  id,
  page,
  limit,
  sortField,
  sortOrder,
  filters,
}: {
  id: string;
} & PaginationParams &
  QueryParams) {
  return useQuery<IInventoryLog>({
    queryKey: [
      queryKeys.GET_PRODUCT_INVENTORY_LOG,
      { id, page, limit, sortField, sortOrder, filters },
    ],
    queryFn: async () => {
      // console.log("filter", filters);
      const res = await inventoryLogApi.findByProduct({
        id,
        page,
        limit,
        sortField,
        sortOrder,
        filters,
      });
      return res.data;
    },
  });
}
