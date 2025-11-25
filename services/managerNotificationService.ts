import {
  CreateNotificationRequest,
  ManagerNotification,
  PaginatedResponse,
} from "@/types/notification";
import { axiosInstance } from "@/lib/axiosInstance";

export const notificationService = {
  getAll: async (page: number, pageSize: number = 20) => {
    const response = await axiosInstance.get<
      PaginatedResponse<ManagerNotification>
    >(`/ManagerNotifications?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<{ data: ManagerNotification }>(
      `/ManagerNotifications/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateNotificationRequest) => {
    const response = await axiosInstance.post("/ManagerNotifications", data);
    return response.data;
  },
  update: async (id: number, data: CreateNotificationRequest) => {
    const response = await axiosInstance.put(
      `/ManagerNotifications/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/ManagerNotifications/${id}`);
    return response.data;
  },
};
