import { envConfig } from "@/common/configs";
import axiosClient from "./axios-client";

export const orderApi = {
  findOne: (id: string) =>
    axiosClient.get(`${envConfig.BACKEND_URL}/orders/${id}`),
};
