import { axiosInstance } from "@/lib/axiosInstance";
import {
  GenerateInvoiceRequest,
  Invoice,
  InvoiceFilter,
  InvoiceListResponse,
  UpdateInvoiceRequest,
} from "@/types/invoices";

export const managerInvoiceService = {
  getAll: async (filter: InvoiceFilter) => {
    const response = await axiosInstance.get<InvoiceListResponse>(
      "/ManagerInvoice",
      {
        params: {
          year: filter.year,
          monthNo: filter.monthNo,
          classId: filter.classId,
          status: filter.status,
          studentName: filter.studentName,
        },
      }
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Invoice>(`/ManagerInvoice/${id}`);
    return response.data;
  },

  generate: async (data: GenerateInvoiceRequest) => {
    const response = await axiosInstance.post("/ManagerInvoice/generate", data);
    return response.data;
  },

  update: async (id: number, data: UpdateInvoiceRequest) => {
    const response = await axiosInstance.put(`/ManagerInvoice/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/ManagerInvoice/${id}`);
    return response.data;
  },

  exportFeeBoard: async (monthNo: number, year: number, classId?: string) => {
    const res = await axiosInstance.get("/ManagerInvoice/export-fee-board", {
      params: {
        monthNo,
        year,
        classId,
      },
      responseType: "blob",
    });
    return res;
  },
};
