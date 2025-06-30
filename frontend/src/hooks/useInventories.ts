import { inventoryApi } from "@/api-client/inventory.api";
import { PaginationParams } from "./useProducts";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";
import { IInventory } from "@/models";

export function useInventories({ page, limit }: PaginationParams) {
  return useQuery<{
    data: IInventory[];
    page: number;
    limit: number;
    total: number;
  }>({
    queryKey: [queryKeys.GET_INVENTORIES_DATA, page, limit],
    queryFn: async () => {
      const res = await inventoryApi.findAll({ page });
      return res.data;
    },
  });
}
