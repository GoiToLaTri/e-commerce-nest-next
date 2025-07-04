import { userInteractionApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { AddUserInteractionPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddUserInteraction() {
  const queryClient = useQueryClient();
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

      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_RECOMMENDATION],
      });

      console.log("Add user interaction success");
    },
    onError: (error) => {
      console.error("Add user interaction failed:", error);
    },
  });
}
