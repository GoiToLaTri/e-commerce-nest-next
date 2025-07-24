import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { DashboardOverview } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetDashboardOverview() {
  return useQuery<DashboardOverview>({
    queryKey: [queryKeys.GET_DASHBOARD_OVERVIEW],
    queryFn: async () => {
      const res = await statisticsApi.dashboardOverview();
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
