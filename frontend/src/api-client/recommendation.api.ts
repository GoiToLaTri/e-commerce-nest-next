import axiosClient from "./axios-client";

export const recommendationApi = {
  getRecommendation: () => axiosClient.get("proxy/recommendation"),
};
