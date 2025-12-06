import { axiosInstance } from "@/lib/axiosInstance";
import { StudentHealthDto } from "@/types/warden";

export const wardenHealthService = {
  getClassHealthRecords: async (
    classId: string
  ): Promise<StudentHealthDto[]> => {
    const res = await axiosInstance.get(
      `/WardensHealth/class/${classId}/chart/health`
    );
    return res.data;
  },

  exportHealthReport: async (classId: string): Promise<Blob> => {
    const res = await axiosInstance.get(
      `/WardensHealth/class/${classId}/health/export`,
      { responseType: "blob" }
    );
    return res.data;
  },
};
