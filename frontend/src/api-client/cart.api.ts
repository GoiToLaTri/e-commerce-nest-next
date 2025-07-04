import { AddToCartPayload } from "@/models";
import axiosClient from "./axios-client";

export const cartApi = {
  getUserCart: () => axiosClient.get(`proxy/cart/client`),
  addToCart: (addToCartPayload: AddToCartPayload) =>
    axiosClient.post("proxy/cart/add", addToCartPayload),
  updateQuantity: (cartItemId: string, quantity: number) =>
    axiosClient.patch(`proxy/cart/item/${cartItemId}`, { quantity }),
  deleteProductFromCart: (cartItemId: string) =>
    axiosClient.delete(`proxy/cart/item/${cartItemId}`),
  clearCart: () => axiosClient.delete(`proxy/cart`),
};
