import { axiosInstance } from "@/lib/axiosInstance";
import {
  PurchaseOrderDetailDto,
  PurchaseOrderSummaryDto,
} from "@/types/kitchen-purchaseOrder";

export const kitchenPurchaseOrderService = {
  getList: async (fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", `${toDate}T23:59:59`);

    const response = await axiosInstance.get<PurchaseOrderSummaryDto[]>(
      `/kitchen/purchase-orders?${params.toString()}`
    );
    return response.data;
  },

  getById: async (orderId: number) => {
    const response = await axiosInstance.get<PurchaseOrderDetailDto>(
      `/kitchen/purchase-orders/${orderId}`
    );
    return response.data;
  },

  createFromPlan: async (formData: FormData) => {
    const response = await axiosInstance.post(
      "/kitchen/purchase-orders/from-plan",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
