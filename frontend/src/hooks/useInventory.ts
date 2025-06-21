import { inventoryApi } from "@/api-client/inventory.api";
import { queryKeys } from "@/common/enums";
import { IInventory } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useInventory(id: string) {
  return useQuery<IInventory>({
    queryKey: [queryKeys.GET_INVENTORY_DATA, id],
    queryFn: async () => {
      const res = await inventoryApi.findOne(id);
      return res.data;
    },
  });
}
