import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { OrderStatusChartData } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetLaptopBrandChart() {
  return useQuery<OrderStatusChartData[]>({
    queryKey: [queryKeys.GET_LAPTOP_BRAND_CHART],
    queryFn: async () => {
      const res = await statisticsApi.getLaptopBrandChartData();
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
