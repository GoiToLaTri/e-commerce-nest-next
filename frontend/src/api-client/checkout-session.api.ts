import axiosClient from "./axios-client";

export const checkoutSessionApi = {
  create: (products: { productId: string; quantity: number }[]) =>
    axiosClient.post(
      "proxy/checkout-session",
      { products },
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    ),
  update: (
    payload: {
      shippingInfo: {
        fullName: string;
        address: string[];
        phone: string;
        delivery: string;
        shippingfee: number;
      };
      paymentMethod: string;
    },
    id: string
  ) => axiosClient.patch(`proxy/checkout-session/${id}`, payload),
};
