import { axiosInstance } from "@/lib/axiosInstance";
import {
  AcademicYearDto,
  CreateAcademicYearRequest,
  UpdateAcademicYearRequest,
} from "@/types/academic-year";
import { CreateClassRequest, UpdateClassRequest } from "@/types/manager-class";

export const managerClassService = {
  getAcademicYears: async (): Promise<AcademicYearDto[]> => {
    const res = await axiosInstance.get<AcademicYearDto[]>(
      "/ManagerClass/academic-years"
    );
    return res.data;
  },
  getAll: async () => {
    const res = await axiosInstance.get("/ManagerClass");
    return res.data;
  },

  create: async (data: CreateClassRequest) => {
    const res = await axiosInstance.post("/ManagerClass", data);
    return res.data;
  },

  update: async (classId: string, data: UpdateClassRequest) => {
    const res = await axiosInstance.put(`/ManagerClass/${classId}`, data);
    return res.data;
  },

  delete: async (classId: string) => {
    const res = await axiosInstance.delete(`/ManagerClass/${classId}`);
    return res.data;
  },

  getTeacherStatus: async () => {
    const res = await axiosInstance.get(
      "/ManagerClass/teachers/assignment-status"
    );
    return res.data;
  },

  getAllAcademicYear: async () => {
    const res = await axiosInstance.get<AcademicYearDto[]>(
      "/ManagerClass/academic-years"
    );
    return res.data;
  },

  createAcademicYear: async (data: CreateAcademicYearRequest) => {
    const res = await axiosInstance.post("/ManagerClass/academic-years", data);
    return res.data;
  },

  updateAcademicYear: async (id: number, data: UpdateAcademicYearRequest) => {
    const res = await axiosInstance.put(
      `/ManagerClass/academic-years/${id}`,
      data
    );
    return res.data;
  },

  deleteAcademicYear: async (id: number) => {
    const res = await axiosInstance.delete(
      `/ManagerClass/academic-years/${id}`
    );
    return res.data;
  },
};
