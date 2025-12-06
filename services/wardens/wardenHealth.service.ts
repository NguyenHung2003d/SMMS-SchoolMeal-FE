import { axiosInstance } from "@/lib/axiosInstance";
import { HealthFormData, HealthRecord } from "@/types/warden-health";
import { WardenClassDto } from "@/types/warden-class";

export const wardenHealthService = {
  getMyClass: async () => {
    const res = await axiosInstance.get<WardenClassDto[]>(
      "/WardensHome/classes"
    );
    return res.data[0] || null;
  },

  getClassHealth: async (classId: string) => {
    const res = await axiosInstance.get(
      `/WardensHealth/class/${classId}/health`
    );
    return Array.isArray(res.data) ? res.data : res.data.data || [];
  },

  getStudentHistory: async (studentId: string) => {
    const res = await axiosInstance.get(
      `/WardensHealth/student/${studentId}/bmi-history`
    );
    const data = Array.isArray(res.data) ? res.data : res.data.data || [];
    return data.sort(
      (a: HealthRecord, b: HealthRecord) =>
        new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
    );
  },

  updateBMI: async ({
    studentId,
    data,
  }: {
    studentId: string;
    data: HealthFormData;
  }) => {
    return axiosInstance.post(`/WardensHealth/student/${studentId}/bmi`, {
      heightCm: parseFloat(data.heightCm),
      weightKg: parseFloat(data.weightKg),
      recordDate: new Date(data.recordDate).toISOString(),
    });
  },

  deleteBMI: async (recordId: string) => {
    return axiosInstance.delete(`/WardensHealth/bmi/${recordId}`);
  },

  exportReport: async (classId: string) => {
    const response = await axiosInstance.get(
      `/WardensHealth/class/${classId}/health/export`,
      { responseType: "blob" }
    );
    return response.data;
  },
};
