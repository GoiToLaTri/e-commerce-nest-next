import { PaginationParams } from "./useProducts";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";
import { IInventory } from "@/models";
import { inventoryApi, QueryParams } from "@/api-client";

export function useInventories(
  query: { search?: string; status?: boolean } & QueryParams & PaginationParams
) {
  return useQuery<{
    data: IInventory[];
    page: number;
    limit: number;
    total: number;
  }>({
    queryKey: [queryKeys.GET_INVENTORIES_DATA, query],
    queryFn: async () => {
      const res = await inventoryApi.findAll({ ...query });
      return res.data;
    },
  });
}
