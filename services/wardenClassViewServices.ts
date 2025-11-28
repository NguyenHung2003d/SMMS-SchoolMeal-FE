import { axiosInstance } from "@/lib/axiosInstance";
import { ClassAttendanceDto, StudentDto } from "@/types/warden";

export const wardenClassService = {
  getStudentsInClass: async (classId: string): Promise<StudentDto[]> => {
    const res = await axiosInstance.get(
      `/WardensViewClass/classes/${classId}/students`
    );
    if (!res.data) throw new Error("Failed to fetch students");
    return res.data;
  },

  getClassAttendance: async (classId: string): Promise<ClassAttendanceDto> => {
    const res = await axiosInstance.get(
      `/WardensViewClass/classes/${classId}/attendance`
    );
    if (!res.data) throw new Error("Failed to fetch attendance");
    return res.data;
  },

  searchStudents: async (classId: string, keyword: string): Promise<any> => {
    const res = await axiosInstance.get(
      `/WardensViewClass/classes/${classId}/search?keyword=${encodeURIComponent(
        keyword
      )}`
    );
    if (!res.data) throw new Error("Search failed");
    return res.data;
  },

  exportClassReport: async (classId: string): Promise<Blob> => {
    const res = await axiosInstance.get(
      `/WardensViewClass/classes/${classId}/export`,
      { responseType: "blob" } // Added for binary file handling
    );
    if (!res.data) throw new Error("Export failed");
    return res.data;
  },
};
