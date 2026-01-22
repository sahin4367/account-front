import axios from "axios";
import { appConfig } from "../consts";

const api = axios.create({
  baseURL: `${appConfig.api_port}/api/v1`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
