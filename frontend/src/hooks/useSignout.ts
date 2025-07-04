import { authApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.signout();
    },
    onSuccess: () => {
      queryClient.setQueryData([queryKeys.USER_SESSION], null);
    },
    onError: (error) => {
      console.error("Sign out failed:", error);
    },
  });
}
