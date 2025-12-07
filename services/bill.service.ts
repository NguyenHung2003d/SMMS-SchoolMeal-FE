import { axiosInstance } from "@/lib/axiosInstance";
import { Invoice, PayOSLinkResponse } from "@/types/invoices";

export const billService = {
  getUnpaidInvoices: async (studentId: string): Promise<Invoice[]> => {
    const res = await axiosInstance.get(
      `/Invoice/invoices-unpaid?studentId=${studentId}`
    );
    return res.data;
  },

  createPaymentLink: async (
    invoiceId: number,
    amount: number,
    description: string
  ): Promise<PayOSLinkResponse> => {
    const res = await axiosInstance.post(
      `/v1/billing/invoices/${invoiceId}/payos/create-payment-link`,
      {
        amount: amount,
        description: description,
      }
    );
    return res.data;
  },

  getInvoiceDetail: async (invoiceId: number, studentId: string) => {
    const res = await axiosInstance.get(
      `/Invoice/${invoiceId}?studentId=${studentId}`
    );
    return res.data;
  },
};
