import axiosClient from "./axios-client";

export const checkoutApi = {
  getCheckoutSession: () => axiosClient.get(`proxy/checkout`),
};
