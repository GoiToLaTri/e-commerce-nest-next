import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { ProductStatistics } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetProductStatistics(id: string) {
  return useQuery<ProductStatistics>({
    queryKey: [queryKeys.GET_PRODUCT_STATISTICS, id],
    queryFn: async () => {
      const res = await statisticsApi.getProductStatistics(id);
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
