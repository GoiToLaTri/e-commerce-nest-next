import {
  StockAdjustmentPayload,
  StockExportPayload,
  StockImportPayload,
} from "@/models";
import axiosClient from "./axios-client";
import { QueryParams } from "./inventory-log.api";
import { PaginationParams } from "@/hooks/useProducts";

export const inventoryApi = {
  findAll: (
    query: { search?: string; status?: boolean } & QueryParams &
      PaginationParams
  ) =>
    axiosClient.get("proxy/inventory", {
      params: {
        page: query.page,
        limit: query.limit,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        search: query.search,
      },
    }),
  findOne: (id: string) => axiosClient.get(`proxy/inventory/${id}`),
  importStock: (stockData: StockImportPayload) =>
    axiosClient.post("proxy/stock-import/", stockData),
  exportStock: (stockData: StockExportPayload) =>
    axiosClient.post("proxy/stock-export/", stockData),
  adjustmentStock: (stockData: StockAdjustmentPayload) =>
    axiosClient.post("proxy/stock-adjustment/", stockData),
};
