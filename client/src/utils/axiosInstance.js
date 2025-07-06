import axios from "axios";
import { base_url } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: base_url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("college-token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const isOnLoginPage = window.location.pathname === "/login";
        if (!isOnLoginPage) {
          // window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error!. Please try again later");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
