import axios from "axios";

const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "/api", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosClient;
