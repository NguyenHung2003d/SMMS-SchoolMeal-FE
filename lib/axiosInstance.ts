import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL =
  process.env.NEXT_PUBLIC_URL_API;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  if (typeof window !== "undefined") {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.dispatchEvent(new Event("auth-session-expired"));
    window.location.href = "/login";
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/Auth/refresh-token")) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post(`${BASE_URL}/Auth/refresh-token`, {
          refreshToken: refreshToken,
        });
        const newToken = data.token || data.accessToken;
        const newRefreshToken = data.refreshToken;

        if (!newToken) throw new Error("Failed to receive new token");

        Cookies.set("accessToken", newToken);
        if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken);
        }

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
