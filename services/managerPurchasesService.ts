import { axiosInstance } from "@/lib/axiosInstance";
import { PurchaseOrderDto } from "@/types/manager-finance";

export const managerPurchasesService = {
  getPurchaseOrders: async (month: number, year: number) => {
    const res = await axiosInstance.get<PurchaseOrderDto[]>(
      `/ManagerFinance/purchase-orders?month=${month}&year=${year}`
    );
    return res.data;
  },

  getPurchaseOrderDetail: async (orderId: number) => {
    const res = await axiosInstance.get(
      `/ManagerFinance/purchase-orders/${orderId}`
    );
    return res.data;
  },

  getRecentPurchases: async (take: number = 8) => {
    const res = await axiosInstance.get(
      `/ManagerHome/recent-purchases?take=${take}`
    );
    return res.data;
  },

  getFinanceSummary: async (month: number, year: number) => {
    const res = await axiosInstance.get(
      `/ManagerFinance/summary?month=${month}&year=${year}`
    );
    return res.data;
  },

  exportPurchaseReport: async (
    month: number,
    year: number,
    isYearly: boolean = false
  ) => {
    const res = await axiosInstance.get("/ManagerFinance/export-purchase", {
      params: { month, year, isYearly },
      responseType: "blob",
    });
    return res.data;
  },
};
