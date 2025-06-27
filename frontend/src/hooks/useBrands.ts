import { brandApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";

export function useBrands() {
  return useQuery({
    queryKey: [queryKeys.GET_BRANDS],
    queryFn: async () => {
      const res = await brandApi.findAll();
      return res.data;
    },
  });
}
