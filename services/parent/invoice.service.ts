import { axiosInstance } from "@/lib/axiosInstance";
import { Invoice, InvoiceDetails } from "@/types/invoices";

export const invoiceService = {
  getMyInvoices: async (studentId: string) => {
    const res = await axiosInstance.get<Invoice[]>("/Invoice/my-invoices", {
      params: { studentId: studentId },
    });
    return res.data;
  },

  getInvoiceDetail: async (invoiceId: number | string, studentId: string) => {
    const res = await axiosInstance.get<InvoiceDetails>(
      `/Invoice/${invoiceId}`,
      {
        params: { studentId: studentId },
      }
    );
    return res.data;
  },
};
