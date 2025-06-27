import { userInteractionApi } from "@/api-client";
import { AddUserInteractionPayload } from "@/models";
import { useMutation } from "@tanstack/react-query";

export function useAddUserInteraction() {
  return useMutation({
    mutationFn: async (userInteractionPyaload: AddUserInteractionPayload) => {
      await userInteractionApi.create(userInteractionPyaload);
      return "Add user interaction success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      //   queryClient.invalidateQueries({
      //     queryKey: [queryKeys.USER_SESSION],
      //   });
      console.log("Add user interaction success");
    },
    onError: (error) => {
      console.error("Add user interaction failed:", error);
    },
  });
}
