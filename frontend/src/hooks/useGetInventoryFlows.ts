import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { InventoryFlow } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetInventoryFlows() {
  return useQuery<InventoryFlow>({
    queryKey: [queryKeys.GET_INVENTORY_FLOWS],
    queryFn: async () => {
      const res = await statisticsApi.getInventoryFlows();
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
