import { PaginationParams } from "@/hooks/useProducts";
import axiosClient from "./axios-client";
import QueryString from "qs";

export interface QueryParams {
  sortField: string;
  sortOrder: string;
  filters: Record<string, unknown>;
}
export const inventoryLogApi = {
  findByProduct: ({
    id,
    page,
    limit,
    sortField,
    sortOrder,
    filters,
  }: {
    id: string;
  } & QueryParams &
    PaginationParams) =>
    axiosClient.get(`proxy/inventory-log/${id}`, {
      params: {
        page,
        limit,
        sortField,
        sortOrder,
        changeType: filters.change_type,
      },
      paramsSerializer: (params) =>
        QueryString.stringify(params, { arrayFormat: "repeat" }),
    }),
};
