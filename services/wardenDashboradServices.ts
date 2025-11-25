import { axiosInstance } from "@/lib/axiosInstance";
import { ClassDto, NotificationDto, StudentDto } from "@/types/warden";

export const wardenDashboardService = {
  getClasses: async (wardenId: string): Promise<ClassDto[]> => {
    const res = await axiosInstance.get(`/WardensHome/classes/${wardenId}`);
    if (!res.data) throw new Error("Failed to fetch classes");
    return res.data;
  },

  getNotifications: async (wardenId: string): Promise<NotificationDto[]> => {
    const res = await axiosInstance.get(
      `/WardensHome/notifications/${wardenId}`
    );
    if (!res.data) return [];
    return res.data;
  },
};
