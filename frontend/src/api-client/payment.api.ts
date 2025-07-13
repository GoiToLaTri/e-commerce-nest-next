import axiosClient from "./axios-client";

export const paymentApi = {
  momoMethod: () => axiosClient.post("proxy/payment/momo-method"),
};
