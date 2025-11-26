import { axiosInstance } from "@/lib/axiosInstance";

export const wardenDashboardService = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/WardensHome/dashboard");
    return response.data;
  },

  getClasses: async () => {
    const response = await axiosInstance.get("/WardensHome/classes");
    return response.data;
  },

  getNotifications: async () => {
    const response = await axiosInstance.get("/WardensHome/notifications");
    return response.data;
  },
};
