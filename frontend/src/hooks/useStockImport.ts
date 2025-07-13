// hooks/useStockImport.js
import { inventoryApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { StockImportPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStockImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stockImportPayload: StockImportPayload) => {
      await inventoryApi.importStock(stockImportPayload);
      return "Stock import success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_INVENTORIES_DATA],
      });
    },
    onError: (error) => {
      console.error("Import failed:", error);
    },
  });
}
