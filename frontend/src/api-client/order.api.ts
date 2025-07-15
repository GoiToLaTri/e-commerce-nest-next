import axiosClient from "./axios-client";
import { PaginationParams } from "@/hooks/useProducts";
import { QueryParams } from "./inventory-log.api";

// const BACKEND_URL = envConfig.BACKEND_URL;

export const orderApi = {
  findBySessionId: (sessionId: string) =>
    axiosClient.get(`proxy/orders/session/${sessionId}`),
  findOne: (id: string) => axiosClient.get(`proxy/orders/${id}`),
  findAll: (
    query: { search?: string; status?: boolean } & QueryParams &
      PaginationParams
  ) =>
    axiosClient.get("proxy/orders", {
      params: {
        page: query.page,
        limit: query.limit,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        paymentStatus: query.filters.paymentStatus,
        orderStatus: query.filters.orderStatus,
        search: query.search,
      },
    }),
};
