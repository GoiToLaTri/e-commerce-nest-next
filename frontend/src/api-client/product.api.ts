import { ProductInfoPayload, ImageResponsePayload, IImage } from "@/models";
import axiosClient from "./axios-client";
import { envConfig } from "@/common/configs";

const FORNTEND_URL = envConfig.FORNTEND_URL;

export const productApi = {
  addProduct: (
    data: ProductInfoPayload & {
      thumbnail: Pick<IImage, "public_id" | "url" | "is_temp">[];
      imageList: Pick<ImageResponsePayload, "images">[];
    }
  ) => axiosClient.post("proxy/product", data),
  getAllProduct: (query: { page: number }) =>
    axiosClient.get("proxy/product", { params: { ...query } }),
  getDetailProduct: (id: string) => axiosClient.get(`proxy/product/${id}`),
  getClientDetailProduct: (id: string) =>
    axiosClient.get(`${FORNTEND_URL}/api/proxy/product/${id}`),
};
