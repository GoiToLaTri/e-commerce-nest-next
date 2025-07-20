import { reviewApi } from "@/api-client/review.api";
import { CreateReviewPayload } from "@/models";
import { useMutation } from "@tanstack/react-query";

export function useCreateReview() {
  return useMutation({
    mutationFn: async ({ payload }: { payload: CreateReviewPayload }) => {
      await reviewApi.create(payload);
      return "Create review success";
    },
    onSuccess: () => {
      //   queryClient.refetchQueries({
      //     queryKey: [queryKeys.GET_CHECKOUT_SESSION],
      //   });
    },
    onError: (error) => {
      console.error("Create review failed:", error);
    },
  });
}
