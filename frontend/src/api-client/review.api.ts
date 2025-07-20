import { CreateReviewPayload } from "@/models";
import axiosClient from "./axios-client";

export const reviewApi = {
  create: (payload: CreateReviewPayload) =>
    axiosClient.post("proxy/review/", payload),
  findByProductId: (id: string) =>
    axiosClient.get(`proxy/review/product/${id}`),
};
