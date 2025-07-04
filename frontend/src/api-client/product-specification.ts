import axiosClient from "./axios-client";

export const productSpecificationApi = {
  findManyCpu: () => axiosClient.get("proxy/product-specification/cpu"),
  findManyRam: () => axiosClient.get("proxy/product-specification/ram"),
  findManyStorage: () => axiosClient.get("proxy/product-specification/storage"),
  findManyGpu: () => axiosClient.get("proxy/product-specification/gpu"),
};
