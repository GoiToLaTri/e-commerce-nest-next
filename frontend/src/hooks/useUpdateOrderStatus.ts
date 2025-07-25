import { orderApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        orderStatus?: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
      };
    }) => {
      await orderApi.updateStatus(id, payload);
      return "Update status success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_ALL_ORDER],
      });
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_ORDER],
      });
      // console.log("Update status success");
    },
    onError: (error) => {
      console.error("Update status failed:", error);
    },
  });
}
