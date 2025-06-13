import { SigninPayload } from "@/models";
import axiosClient from "./axios-client";

export const authApi = {
  signin: (payload: SigninPayload) => axiosClient.post("proxy/signin", payload),
  signout: () => axiosClient.post("proxy/auth/logout"),
  getUserSession: () => axiosClient.get("proxy/auth/user-session"),
};
