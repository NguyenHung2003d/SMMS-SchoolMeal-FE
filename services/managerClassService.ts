import { axiosInstance } from "@/lib/axiosInstance";
import { CreateClassRequest, UpdateClassRequest } from "@/types/manager-class";

export const managerClassService = {
  // 🟢 GET ALL
  getAll: async () => {
    const res = await axiosInstance.get("/ManagerClass");
    return res.data;
  },

  // 🟡 CREATE
  create: async (data: CreateClassRequest) => {
    const res = await axiosInstance.post("/ManagerClass", data);
    return res.data;
  },

  // 🟠 UPDATE
  update: async (classId: string, data: UpdateClassRequest) => {
    const res = await axiosInstance.put(`/ManagerClass/${classId}`, data);
    return res.data;
  },

  // 🔴 DELETE
  delete: async (classId: string) => {
    const res = await axiosInstance.delete(`/ManagerClass/${classId}`);
    return res.data;
  },

  // 🧑‍🏫 GET TEACHERS STATUS (Lấy danh sách giáo viên để gán lớp)
  getTeacherStatus: async () => {
    const res = await axiosInstance.get(
      "/ManagerClass/teachers/assignment-status"
    );
    return res.data;
  },
};
