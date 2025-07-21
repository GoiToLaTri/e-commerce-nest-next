import axiosClient from "./axios-client";

export const statisticsApi = {
  getProductStatistics: (id: string) =>
    axiosClient.get(`proxy/statistics/product/${id}`),
};
