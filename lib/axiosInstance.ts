import axios from "axios";
import toast from "react-hot-toast";

export const BASE_URL = process.env.NEXT_PUBLIC_URL_API;
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

const extendToken = async () => {
  try {
    console.log("🔄 Attempting to extend token...");
    await axiosInstance.post("auth/extendToken");
    console.log("✅ Token extended successfully");
    return true;
  } catch (error) {
    console.log("❌ Extend token failed:", error);
    return false;
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(null);
    }
  });
  failedQueue = [];
};

const handleSessionExpired = () => {
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/login")
  ) {
    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    window.location.href = "/login";
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/extendToken")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const didExtend = await extendToken();
        if (didExtend) {
          console.log("🔄 Retrying original request (cookie is updated)");
          processQueue(null);
          return axiosInstance(originalRequest);
        } else {
          console.log("🚪 Cannot extend token, triggering logout");
          processQueue(error);

          handleSessionExpired();

          return Promise.reject(error);
        }
      } catch (error) {
        console.error("💥 Token renewal process failed:", error);
        processQueue(error);

        handleSessionExpired();

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        window.location.href = "/login";
      handleSessionExpired();
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
