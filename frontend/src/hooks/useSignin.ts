import { authApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { SigninPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (signinPayload: SigninPayload) => {
      await authApi.signin(signinPayload);
      return "Login success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USER_SESSION],
      });
    },
    onError: (error) => {
      console.error("Singin failed:", error);
    },
  });
}
