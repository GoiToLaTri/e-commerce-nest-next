import { AxiosRequestConfig } from "axios";
import axiosClient from "./axios-client";

export const uploadApi = {
  images: (fromData: FormData, axiosConfigs?: AxiosRequestConfig) =>
    axiosClient.post("proxy/upload/image", fromData, axiosConfigs),
  thumbnail: (fromData: FormData, axiosConfigs?: AxiosRequestConfig) =>
    axiosClient.post("proxy/upload/thumbnail", fromData, axiosConfigs),
};
