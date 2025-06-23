import { PaginationParams } from "@/hooks/useProducts";
import axiosClient from "./axios-client";
import { QueryParams } from "./inventory-log.api";
import QueryString from "qs";

export const stockHistoryApi = {
  findAll: ({
    page,
    limit,
    filters,
    sortField,
    sortOrder,
    search,
  }: { search?: string } & QueryParams & PaginationParams) =>
    axiosClient.get(`proxy/stock-history`, {
      params: {
        page,
        limit,
        sortField,
        sortOrder,
        changeType: filters.change_type,
        search,
      },
      paramsSerializer: (params) =>
        QueryString.stringify(params, { arrayFormat: "repeat" }),
    }),
};
