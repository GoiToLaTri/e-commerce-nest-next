import { authApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";

export const useUserSession = () => {
  return useQuery({
    queryKey: [queryKeys.USER_SESSION],
    queryFn: async () => {
      const res = await authApi.getUserSession();
      return res.data; // chứa session_user
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 60 * 24, // 1 ngày
    retry: false, // nếu 401 thì không retry
  });
};
