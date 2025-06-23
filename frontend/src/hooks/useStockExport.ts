// hooks/useStockImport.js
import { inventoryApi } from "@/api-client/inventory.api";
import { queryKeys } from "@/common/enums";
import { StockExportPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStockExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stockExportPayload: StockExportPayload) => {
      await inventoryApi.exportStock(stockExportPayload);
      return "Stock export success";
    },
    onSuccess: () => {
      // Tự động invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_INVENTORIES_DATA],
      });
    },
    onError: (error) => {
      console.error("Export failed:", error);
    },
  });
}
