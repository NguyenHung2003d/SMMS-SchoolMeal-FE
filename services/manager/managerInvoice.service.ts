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
    const params = new URLSearchParams();
    if (filter.monthNo) params.append("monthNo", filter.monthNo.toString());
    if (filter.year) params.append("year", filter.year.toString());
    if (filter.status) params.append("status", filter.status);

    const response = await axiosInstance.get<InvoiceListResponse>(
      `/ManagerInvoice/?${params.toString()}`
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
};
