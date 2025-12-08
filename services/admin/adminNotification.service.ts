import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateNotificationDto,
  NotificationDetailDto,
} from "@/types/admin-notification";
import { NotificationDto } from "@/types/notification";

export const adminNotificationService = {
  getHistory: async (): Promise<NotificationDto[]> => {
    const res = await axiosInstance.get("/Notifications/history");
    return res.data;
  },

  getById: async (id: number): Promise<NotificationDetailDto> => {
    const res = await axiosInstance.get(`/Notifications/${id}`);
    return res.data;
  },

  create: async (dto: CreateNotificationDto): Promise<any> => {
    const res = await axiosInstance.post("/Notifications", dto);
    return res.data;
  },
};
