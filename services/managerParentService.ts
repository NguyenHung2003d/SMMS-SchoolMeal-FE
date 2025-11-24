import { axiosInstance } from "@/lib/axiosInstance";
import { CreateParentRequest } from "@/types/manager-parent";

export const parentService = {
  getAll: async () => {
    const res = await axiosInstance.get("/ManagerParent");
    return res.data;
  },

  search: async (keyword: string) => {
    const res = await axiosInstance.get("/ManagerParent/search", {
      params: {
        keyword: keyword.trim(),
      },
    });
    return res.data;
  },

  create: async (data: CreateParentRequest) => {
    const res = await axiosInstance.post("/ManagerParent", data);
    return res.data;
  },

  changeStatus: async (userId: string, isActive: boolean) => {
    const res = await axiosInstance.patch(
      `/ManagerParent/${userId}/status`,
      null,
      { params: { isActive } }
    );
    return res.data;
  },

  delete: async (userId: string) => {
    const res = await axiosInstance.delete(`/ManagerParent/${userId}`);
    return res.data;
  },

  importExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(
      "/ManagerParent/import-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          createdBy: "Manager",
        },
      }
    );
    return res.data;
  },

  downloadTemplate: async () => {
    const res = await axiosInstance.get("/ManagerParent/download-template", {
      responseType: "blob",
    });
    return res.data;
  },
};
