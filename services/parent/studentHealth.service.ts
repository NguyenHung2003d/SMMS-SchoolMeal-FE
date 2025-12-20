import { axiosInstance } from "@/lib/axiosInstance";
import { StudentBMIResultDto } from "@/types/parent";

export const studentHealthService = {
  getCurrentHealth: async (studentId: string) => {
    const res = await axiosInstance.get<StudentBMIResultDto>(
      `/StudentHealth/current/${studentId}`
    );
    return res.data;
  },

  getHealthHistory: async (studentId: string) => {
    const res = await axiosInstance.get<StudentBMIResultDto[]>(
      `/StudentHealth/history/${studentId}`
    );
    return res.data;
  },
};
