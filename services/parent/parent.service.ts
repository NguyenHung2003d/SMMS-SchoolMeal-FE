import { axiosInstance } from "@/lib/axiosInstance";
import { AllergenDTO } from "@/types/parent";

export const parentService = {
  getAllergensByStudent: async (studentId: string): Promise<AllergenDTO[]> => {
    const response = await axiosInstance.get<AllergenDTO[]>(
      `/ParentViewAllergen/by-student/${studentId}`
    );
    return response.data;
  },

  addStudentAllergy: async (
    studentId: string,
    data: {
      allergenId: string | number | null;
      allergenName: string | null;
      allergenInfo?: string;
    }
  ) => {
    return axiosInstance.post(
      `/ParentViewAllergen/by-student/${studentId}`,
      data
    );
  },
};
