import axiosClient from "./axios-client";

export const searchApi = {
  searchProducts: (query: string) => {
    return axiosClient.get(`proxy/search/products`, {
      params: { q: query },
    });
  },
};
