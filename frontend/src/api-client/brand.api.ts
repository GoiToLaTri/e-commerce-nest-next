import axiosClient from "./axios-client";

export const brandApi = {
  findAll: () => axiosClient.get("proxy/brand"),
};
