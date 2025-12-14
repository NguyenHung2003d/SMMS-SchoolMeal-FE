import { axiosInstance } from "@/lib/axiosInstance";
import { AllergenDTO } from "@/types/parent-nutrition";

export const parentService = {
  getAllergensByStudent: async (studentId: string): Promise<AllergenDTO[]> => {
    const response = await axiosInstance.get<AllergenDTO[]>(
      `/ParentViewAllergen/by-student/${studentId}`
    );
    return response.data;
  },
};
