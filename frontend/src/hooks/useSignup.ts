import { authApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { SignupPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (signupPayload: SignupPayload) => {
      await authApi.signup(signupPayload);
      return "Sign up success";
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
