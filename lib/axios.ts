import Axios, { InternalAxiosRequestConfig } from "axios";
import storage from "./storage";
import { toast } from "sonner";

export const api_client = Axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/v1"
      : "https://nibay.co/api/v1"
});

api_client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
    return config;
  }
);

api_client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const messageData =
      error.response?.data?.error || error.response?.data?.message;
    const status = error.response?.status;

    if (status === 404) {
      toast.error("দুঃখিত! কোনো তথ্য পাওয়া যায়নি।");
    } else if (status === 401) {
      // toast.error("দুঃখিত! আপনার এই রুটে প্রবেশাধিকার নেই।");
    } else if (status === 403) {
      storage.clearToken();
    } else if (status === 500) toast.error("দুঃখিত! কোনো একটা সমস্যা হয়েছে।");
    else toast.error(messageData);

    return Promise.reject(error);
  }
);
