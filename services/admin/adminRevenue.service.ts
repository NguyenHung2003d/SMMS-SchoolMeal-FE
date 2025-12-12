import { axiosInstance } from "@/lib/axiosInstance";
import { CreateSchoolRevenueDto } from "@/types/admin-revenue";
import { SchoolRevenue, UpdateSchoolRevenueDto } from "@/types/admin-school";

export const adminSchoolRevenueService = {
  create: async (data: CreateSchoolRevenueDto) => {
    const formData = new FormData();
    formData.append("schoolId", data.schoolId);
    formData.append("revenueDate", data.revenueDate);
    formData.append("revenueAmount", data.revenueAmount.toString());
    formData.append("contractCode", data.contractCode);

    if (data.contractNote) {
      formData.append("contractNote", data.contractNote);
    }

    if (data.contractFile) {
      formData.append("contractFile", data.contractFile);
    }

    const res = await axiosInstance.post("/SchoolContact", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  getBySchool: async (schoolId: string): Promise<SchoolRevenue[]> => {
    const res = await axiosInstance.get(`/SchoolContact?schoolId=${schoolId}`);
    return res.data;
  },

  update: async (
    revenueId: number,
    data: UpdateSchoolRevenueDto,
    file?: File | null
  ) => {
    const formData = new FormData();

    formData.append("revenueId", revenueId.toString());
    formData.append("schoolId", data.schoolId);
    formData.append("revenueDate", data.revenueDate);
    formData.append("revenueAmount", data.revenueAmount.toString());
    formData.append("contractCode", data.contractCode);

    formData.append("contractNote", data.contractNote || "");

    if (file) {
      formData.append("contractFile", file);
    }

    const res = await axiosInstance.put(
      `/SchoolContact/${revenueId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  delete: async (revenueId: number) => {
    const res = await axiosInstance.delete(`/SchoolContact/${revenueId}`);
    return res.data;
  },
};
