import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const extendToken = async () => {
  try {
    console.log("🔄 Attempting to extend token...");
    await axios.post(
      `${BASE_URL}/Auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    console.log("✅ Token extended successfully");
    return true;
  } catch (error) {
    console.log("❌ Extend token failed:", error);
    return false;
  }
};

const handleSessionExpired = () => {
  if (typeof window !== "undefined") {
    if (!window.location.pathname.includes("/login")) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/login";
    }
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.toLowerCase().includes("/auth/refresh-token")) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    if (!originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const success = await extendToken();

        if (success) {
          processQueue(null);
          return axiosInstance(originalRequest);
        } else {
          processQueue(error, null);
          handleSessionExpired();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleSessionExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const fetchFromAPI = async (url: any) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching from API:", error);
    throw error;
  }
};
