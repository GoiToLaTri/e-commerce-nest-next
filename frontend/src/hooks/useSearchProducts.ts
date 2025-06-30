import { searchApi } from "@/api-client/search.api";
import { queryKeys } from "@/common/enums";
import { IProductResponse } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useSearchProducts(query: string) {
  return useQuery<IProductResponse>({
    queryKey: [queryKeys.SEARCH_PRODUCTS, query],
    queryFn: async () => {
      const res = await searchApi.searchProducts(query);
      return res.data;
    },
    enabled: !!query, // Only run the query if the query string is not empty
    refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
  });
}
