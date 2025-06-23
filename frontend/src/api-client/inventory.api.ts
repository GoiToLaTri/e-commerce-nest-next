import {
  StockAdjustmentPayload,
  StockExportPayload,
  StockImportPayload,
} from "@/models";
import axiosClient from "./axios-client";

export const inventoryApi = {
  findAll: (query: { page: number }) =>
    axiosClient.get("proxy/inventory", { params: { ...query } }),
  findOne: (id: string) => axiosClient.get(`proxy/inventory/${id}`),
  importStock: (stockData: StockImportPayload) =>
    axiosClient.post("proxy/stock-import/", stockData),
  exportStock: (stockData: StockExportPayload) =>
    axiosClient.post("proxy/stock-export/", stockData),
  adjustmentStock: (stockData: StockAdjustmentPayload) =>
    axiosClient.post("proxy/stock-adjustment/", stockData),
};
