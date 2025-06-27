import { ProductInfoPayload, ImageResponsePayload, IImage } from "@/models";
import axiosClient from "./axios-client";
import { envConfig } from "@/common/configs";
import { QueryParams } from "./inventory-log.api";
import { PaginationParams } from "@/hooks/useProducts";

const FORNTEND_URL = envConfig.FORNTEND_URL;

export const productApi = {
  addProduct: (
    data: ProductInfoPayload & {
      thumbnail: Pick<IImage, "public_id" | "url" | "is_temp">[];
      imageList: Pick<ImageResponsePayload, "images">[];
    }
  ) => axiosClient.post("proxy/product", data),
  getAllProduct: (
    query: { search?: string; status?: boolean } & QueryParams &
      PaginationParams
  ) =>
    axiosClient.get("proxy/product", {
      params: {
        page: query.page,
        limit: query.limit,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        laptopBrand: query.filters.laptopbrand,
        status: query.filters.sale_status,
        search: query.search,
      },
    }),
  getDetailProduct: (id: string) => axiosClient.get(`proxy/product/${id}`),
  getClientDetailProduct: (id: string) =>
    axiosClient.get(`${FORNTEND_URL}/api/proxy/product/${id}`),
  findAll: (query: { page: number }) =>
    axiosClient.get(`${FORNTEND_URL}/api/proxy/product/customer`, {
      params: { ...query },
    }),
};
