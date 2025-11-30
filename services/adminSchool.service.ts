import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateSchoolDto,
  SchoolDTO,
  UpdateSchoolDto,
} from "@/types/admin-school";

export const adminSchoolService = {
  getAll: async (): Promise<SchoolDTO[]> => {
    const res = await axiosInstance.get("/SchoolsControllerA");
    return res.data;
  },

  getById: async (id: string): Promise<SchoolDTO | undefined> => {
    const res = await axiosInstance.get(`/SchoolsControllerA/${id}`);
    return res.data;
  },

  create: async (dto: CreateSchoolDto): Promise<string> => {
    const res = await axiosInstance.post("/SchoolsControllerA", dto);
    return res.data;
  },

  update: async (id: string, dto: UpdateSchoolDto): Promise<void> => {
    const res = await axiosInstance.put(`/SchoolsControllerA/${id}`, dto);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    const res = await axiosInstance.delete(`/SchoolsControllerA/${id}`);
    return res.data;
  },
};
