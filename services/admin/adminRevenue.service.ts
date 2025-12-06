import { axiosInstance } from "@/lib/axiosInstance";
import { CreateSchoolRevenueDto } from "@/types/admin-revenue";

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
};
