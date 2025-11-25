import { axiosInstance } from "@/lib/axiosInstance";
import {
  FinanceSummaryDto,
  InvoiceDetailDto,
  InvoiceDto,
  PurchaseOrderDetailDto,
  PurchaseOrderDto,
} from "@/types/manager-finance";

export const managerFinanceService = {
  getSummary: async (month: number, year: number) => {
    const res = await axiosInstance.get<FinanceSummaryDto>(
      `/ManagerFinance/summary?month=${month}&year=${year}`
    );
    return res.data;
  },

  getAllInvoices: async () => {
    const res = await axiosInstance.get<InvoiceDto[]>(
      "/ManagerFinance/invoices"
    );
    return res.data;
  },

  searchInvoices: async (keyword: string) => {
    const res = await axiosInstance.get<{ count: number; data: InvoiceDto[] }>(
      `/ManagerFinance/invoices/search?keyword=${keyword}`
    );
    return res.data.data;
  },

  filterInvoices: async (status: string) => {
    const res = await axiosInstance.get<{ count: number; data: InvoiceDto[] }>(
      `/ManagerFinance/invoices/filter?status=${status}`
    );
    return res.data.data;
  },

  getInvoiceDetail: async (invoiceId: number) => {
    const res = await axiosInstance.get<InvoiceDetailDto>(
      `/ManagerFinance/invoices/${invoiceId}`
    );
    return res.data;
  },

  getPurchaseOrders: async (month: number, year: number) => {
    const res = await axiosInstance.get<PurchaseOrderDto[]>(
      `/ManagerFinance/purchase-orders?month=${month}&year=${year}`
    );
    return res.data;
  },

  getPurchaseOrderDetail: async (orderId: number) => {
    const res = await axiosInstance.get<PurchaseOrderDetailDto>(
      `/ManagerFinance/purchase-orders/${orderId}`
    );
    return res.data;
  },

  exportFinanceReport: async (month: number, year: number) => {
    const res = await axiosInstance.get(
      `/ManagerFinance/export?month=${month}&year=${year}`,
      { responseType: "blob" }
    );
    return res.data;
  },

  exportPurchaseReport: async (month: number, year: number) => {
    const res = await axiosInstance.get(
      `/ManagerFinance/export-purchase?month=${month}&year=${year}`,
      { responseType: "blob" }
    );
    return res.data;
  },
};
