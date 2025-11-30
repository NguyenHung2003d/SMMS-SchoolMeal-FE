import { axiosInstance } from "@/lib/axiosInstance";
import { StudentHealthDto } from "@/types/warden";

export const wardenHealthService = {
  // GET: /api/WardensHealth/class/{classId}/chart/health
  // API này trả về danh sách lịch sử sức khỏe (dùng Handler GetStudentsHealthQuery)
  getClassHealthRecords: async (
    classId: string
  ): Promise<StudentHealthDto[]> => {
    const res = await axiosInstance.get(
      `/WardensHealth/class/${classId}/chart/health`
    );
    return res.data;
  },

  // GET: /api/WardensHealth/class/{classId}/health/export
  exportHealthReport: async (classId: string): Promise<Blob> => {
    const res = await axiosInstance.get(
      `/WardensHealth/class/${classId}/health/export`,
      { responseType: "blob" }
    );
    return res.data;
  },
};
