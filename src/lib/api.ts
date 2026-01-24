import axios from "axios";
import { appConfig } from "../consts";

const api = axios.create({
  baseURL: `${appConfig.api_url}/api/v1`,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
