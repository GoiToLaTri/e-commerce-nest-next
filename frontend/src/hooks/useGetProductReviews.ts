import { reviewApi } from "@/api-client/review.api";
import { queryKeys } from "@/common/enums";
import { Review } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetProductReviews(id: string) {
  return useQuery<Review[]>({
    queryKey: [queryKeys.GET_REVIEW_BY_PRODUCT_ID, id],
    queryFn: async () => {
      const res = await reviewApi.findByProductId(id);
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
