import { recommendationApi } from "@/api-client/recommendation.api";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";

export const useRecommendation = () => {
  return useQuery({
    queryKey: [queryKeys.GET_RECOMMENDATION],
    queryFn: async () => {
      const res = await recommendationApi.getRecommendation();
      return res.data;
    },
    // staleTime: 1000 * 60 * 5, // 5 phút
    // gcTime: 1000 * 60 * 60 * 24, // 1 ngày
    retry: false,
  });
};
