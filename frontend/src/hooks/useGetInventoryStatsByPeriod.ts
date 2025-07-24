import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { InventoryStatsResult } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetInventoryStatsByPeriod(
  period: "week" | "month" | "6months" | "year"
) {
  return useQuery<InventoryStatsResult[]>({
    queryKey: [queryKeys.GET_INVENTORY_STATS_BY_PERIOD],
    queryFn: async () => {
      const res = await statisticsApi.getInventoryStatsByPeriod(period);
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
