import { axiosInstance } from "@/lib/axiosInstance";
import { StudentImageDto } from "@/types/parent";

export const parentStudentImageService = {
  getImagesByStudent: async (studentId: string): Promise<StudentImageDto[]> => {
    try {
      const res = await axiosInstance.get<StudentImageDto[]>(
        `/ParentViewStudentImages/student/${studentId}`
      );
      return res.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
};
