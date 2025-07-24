import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { OrderStatusChartData } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetOrderStatusChart() {
  return useQuery<OrderStatusChartData[]>({
    queryKey: [queryKeys.GET_ORDER_STATUS_CHART],
    queryFn: async () => {
      const res = await statisticsApi.getOrderStatusChartData();
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
