import axiosClient from "./axios-client";
import { AddUserInteractionPayload } from "@/models";

export const userInteractionApi = {
  create: (payload: AddUserInteractionPayload) =>
    axiosClient.post("proxy/user-interaction", payload),
};
