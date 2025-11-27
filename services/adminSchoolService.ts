import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateSchoolDto,
  SchoolDTO,
  UpdateSchoolDto,
} from "@/types/admin-school";

export const adminSchoolService = {
  getAll: async (): Promise<SchoolDTO[]> => {
    const res = await axiosInstance.get("/Schools");
    return res.data;
  },

  getById: async (id: string): Promise<SchoolDTO | undefined> => {
    const res = await axiosInstance.get(`/Schools/${id}`);
    return res.data;
  },

  create: async (dto: CreateSchoolDto): Promise<string> => {
    const res = await axiosInstance.post("/Schools", dto);
    return res.data;
  },

  update: async (id: string, dto: UpdateSchoolDto): Promise<void> => {
    const res = await axiosInstance.put(`/Schools/${id}`, dto);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    const res = await axiosInstance.delete(`/Schools/${id}`);
    return res.data;
  },
};
