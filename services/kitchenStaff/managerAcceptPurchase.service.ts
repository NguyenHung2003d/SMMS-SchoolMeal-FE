import { axiosInstance } from "@/lib/axiosInstance";
import { PurchaseOrderSummaryDto } from "@/types/kitchen-purchaseOrder";
import {
  PurchaseOrderDetail,
} from "@/types/manager-purchaseOrder";

export const managerAcceptPurchaseService = {
  getList: async (fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const res = await axiosInstance.get<PurchaseOrderSummaryDto[]>(
      "/manager/AcceptPurchase"
    );
    return res.data;
  },

  getById: async (orderId: number) => {
    const res = await axiosInstance.get<PurchaseOrderDetail>(
      `/manager/AcceptPurchase/${orderId}`
    );
    return res.data;
  },

  confirm: async (orderId: number) => {
    const res = await axiosInstance.post(
      `/manager/AcceptPurchase/${orderId}/confirm`
    );
    return res.data;
  },

  reject: async (orderId: number) => {
    const res = await axiosInstance.post(
      `/manager/AcceptPurchase/${orderId}/Reject`
    );
    return res.data;
  },
};
