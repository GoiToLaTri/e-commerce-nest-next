// hooks/useStockImport.js
import { inventoryApi } from "@/api-client/inventory.api";
import { queryKeys } from "@/common/enums";
import { StockAdjustmentPayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStockAjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stockAdjustmentPayload: StockAdjustmentPayload) => {
        await inventoryApi.adjustmentStock(stockAdjustmentPayload);
      return "Stock ajustment success";
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
