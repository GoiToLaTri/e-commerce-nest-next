import { ProductInfoPayload, ImageResponsePayload, IImage } from "@/models";
import axiosClient from "./axios-client";
import { envConfig } from "@/common/configs";
import { QueryParams } from "./inventory-log.api";
import { PaginationParams } from "@/hooks/useProducts";

const BACKEND_URL = envConfig.BACKEND_URL;

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
    // axiosClient.get(`${FRONTEND_URL}/api/proxy/product/${id}`),
    axiosClient.get(`${BACKEND_URL}/product/${id}`),
  findAll: (query: PaginationParams & Partial<QueryParams>) =>
    axiosClient.get(`${BACKEND_URL}/product/customer`, {
      params: {
        page: query.page,
        limit: query.limit,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        laptopBrand: query?.filters?.laptopbrand,
        cpuBrands: query?.filters?.cpu_brand,
        cpuSeries: query?.filters?.cpu_series,
      },
    }),
  // axiosClient.get(`${FRONTEND_URL}/api/proxy/product/customer`, {
  //   params: {
  //     page: query.page,
  //     limit: query.limit,
  //     sortField: query.sortField,
  //     sortOrder: query.sortOrder,
  //     laptopBrand: query?.filters?.laptopbrand,
  //     cpuBrands: query?.filters?.cpu_brand,
  //     cpuSeries: query?.filters?.cpu_series,
  //   },
  // }),
  findAllClient: (query: PaginationParams & Partial<QueryParams>) =>
    axiosClient.get(`proxy/product/customer`, {
      params: {
        page: query.page,
        limit: query.limit,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        laptopBrand: query?.filters?.laptopbrand,
        cpuBrands: query?.filters?.cpu_brand,
        cpuSeries: query?.filters?.cpu_series,
      },
    }),
};
