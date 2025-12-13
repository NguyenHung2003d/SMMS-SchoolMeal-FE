// import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_URL_API

// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     if (isRefreshing) {
//       return new Promise(function (resolve, reject) {
//         failedQueue.push({ resolve, reject });
//       })
//         .then(() => {
//           return axiosInstance(originalRequest);
//         })
//         .catch((err) => {
//           return Promise.reject(err);
//         });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       await axios.post(
//         "/api/proxy/Auth/refresh-token",
//         {},
//         { withCredentials: true }
//       );

//       processQueue(null);
//       return axiosInstance(originalRequest);
//     } catch (refreshError) {
//       processQueue(refreshError, null);

//       if (typeof window !== "undefined") {
//         localStorage.removeItem("selectedStudent");

//         const path = window.location.pathname;
//         if (
//           !path.startsWith("/login") &&
//           !path.startsWith("/register") &&
//           !path.startsWith("/forgot-password")
//         ) {
//           window.location.href = "/login";
//         }
//       }
//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// Dưới ni là của dev local
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

let isRefreshing = false;

let failedQueue: any[] = [];

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

axiosInstance.interceptors.request.use(
  (config) => config,

  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
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
      await axios.post(
        "http://localhost:5000/api/Auth/refresh-token",
        {},
        {
          withCredentials: true,
        }
      );

      processQueue(null);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("currentUser");

        const path = window.location.pathname;

        if (
          !path.startsWith("/login") &&
          !path.startsWith("/register") &&
          !path.startsWith("/forgot-password")
        ) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
