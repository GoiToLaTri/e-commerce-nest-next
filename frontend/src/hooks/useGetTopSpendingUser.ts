import { statisticsApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { TopSpendingUser } from "@/models";
import { useQuery } from "@tanstack/react-query";

export function useGetTopSpendingUser() {
  return useQuery<TopSpendingUser[]>({
    queryKey: [queryKeys.GET_TOP_SPENDING_USER],
    queryFn: async () => {
      const res = await statisticsApi.getTopSpendingUsers();
      return res.data;
    },
    gcTime: 0,
    retry: false,
  });
}
