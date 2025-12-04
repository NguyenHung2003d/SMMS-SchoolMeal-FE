import { axiosInstance } from "@/lib/axiosInstance";
import { PurchasePlan, PurchasePlanItem } from "@/types/kitchen-purchasePlan";

export const kitchenPurchasePlanService = {
  updatePlan: async (
    planId: number,
    data: {
      planId: number;
      planStatus: string;
      lines: PurchasePlanItem[];
      supplierName?: string;
    }
  ) => {
    const response = await axiosInstance.put(`/purchase-plans/${planId}`, data);
    return response.data;
  },
  getCurrentPlan: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await axiosInstance.get<PurchasePlan>(
      "/purchase-plans/by-date",
      { params }
    );
    return response.data;
  },

  searchIngredients: async (keyword: string) => {
    const response = await axiosInstance.get(
      `/nutrition/fooditems?keyword=${keyword}`
    );
    return response.data;
  },

  createPurchaseOrder: async (payload: {
    planId: number;
    supplierName: string;
    note: string;
    lines: {
      ingredientId: number;
      quantityOverrideGram?: number;
      unitPrice?: number;
      batchNo?: string;
      origin?: string;
      expiryDate?: string;
    }[];
  }) => {
    const response = await axiosInstance.post(
      "/kitchen/purchase-orders/from-plan",
      payload
    );
    return response.data;
  },
};
