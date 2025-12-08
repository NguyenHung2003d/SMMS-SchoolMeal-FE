import { axiosInstance } from "@/lib/axiosInstance";
import { PurchasePlan, PurchasePlanLine } from "@/types/kitchen-purchasePlan";

export interface UpdatePurchasePlanRequest {
  planId: number;
  planStatus: string;
  lines: PurchasePlanLine[];
}

export const kitchenPurchasePlanService = {
  getPlanByDate: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await axiosInstance.get<PurchasePlan>(
      "/purchase-plans/by-date",
      { params }
    );
    return response.data;
  },

  getPlanById: async (planId: number) => {
    const response = await axiosInstance.get<PurchasePlan>(
      `/purchase-plans/${planId}`
    );
    return response.data;
  },

  updatePlan: async (planId: number, data: UpdatePurchasePlanRequest) => {
    const response = await axiosInstance.put<PurchasePlan>(
      `/purchase-plans/${planId}`,
      data
    );
    return response.data;
  },

  createFromSchedule: async (scheduleMealId: number) => {
    const response = await axiosInstance.post<PurchasePlan>(
      `/purchase-plans/from-schedule`,
      null,
      {
        params: { scheduleMealId },
      }
    );
    return response.data;
  },

  deletePlan: async (planId: number) => {
    const response = await axiosInstance.delete(`/purchase-plans/${planId}`);
    return response.data;
  },

  searchIngredients: async (keyword: string) => {
    const response = await axiosInstance.get(
      `/nutrition/fooditems?keyword=${keyword}`
    );
    return response.data;
  },
};
