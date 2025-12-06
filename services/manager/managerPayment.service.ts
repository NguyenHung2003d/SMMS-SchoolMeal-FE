import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateSchoolPaymentSettingRequest,
  SchoolPaymentSettingDto,
  UpdateSchoolPaymentSettingRequest,
} from "@/types/manager-payment";

export const paymentService = {
  getBySchool: async () => {
    const response = await axiosInstance.get(
      "/ManagerPaymentSetting/school/current"
    );
    return response.data.data;
  },

  getById: async (settingId: number): Promise<SchoolPaymentSettingDto> => {
    try {
      const response = await axiosInstance.get(
        `/ManagerPaymentSetting/${settingId}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data: CreateSchoolPaymentSettingRequest) => {
    try {
      const response = await axiosInstance.post("/ManagerPaymentSetting", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (
    settingId: number,
    data: UpdateSchoolPaymentSettingRequest
  ) => {
    try {
      const response = await axiosInstance.put(
        `/ManagerPaymentSetting/${settingId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (settingId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/ManagerPaymentSetting/${settingId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
