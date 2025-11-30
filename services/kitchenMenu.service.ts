import { axiosInstance } from "@/lib/axiosInstance";
import {
  DailyMeal,
  FoodItem,
  MenuFoodItem,
  ScheduleMeal,
  UpdateFoodItemRequest,
} from "@/types/kitchen-menu";

export const kitchenMenuService = {
  getScheduleMeals: async (): Promise<ScheduleMeal[]> => {
    const res = await axiosInstance.get<ScheduleMeal[]>("/ScheduleMeals");
    return res.data;
  },

  getAllDailyMeals: async (): Promise<DailyMeal[]> => {
    const res = await axiosInstance.get<DailyMeal[]>("/DailyMeals");
    return res.data;
  },

  getMenuFoodItems: async (): Promise<MenuFoodItem[]> => {
    const res = await axiosInstance.get<MenuFoodItem[]>("/MenuFoodItems");
    return res.data;
  },

  // --- API FoodItems (Refactor theo Controller mới) ---
  getFoodItems: async (keyword?: string): Promise<FoodItem[]> => {
    const res = await axiosInstance.get<FoodItem[]>("/nutrition/FoodItems", {
      params: { keyword }, 
    });
    return res.data;
  },

  getFoodItemById: async (id: number): Promise<FoodItem> => {
    const res = await axiosInstance.get<FoodItem>(`/nutrition/FoodItems/${id}`);
    return res.data;
  },

  createFoodItem: async (data: Omit<FoodItem, "foodId">) => {
    return await axiosInstance.post("/nutrition/FoodItems", data);
  },

  updateFoodItem: async (id: number, data: UpdateFoodItemRequest) => {
    return await axiosInstance.put(`/nutrition/FoodItems/${id}`, data);
  },

  deleteFoodItem: async (id: number, hardDelete: boolean = false) => {
    return await axiosInstance.delete(`/nutrition/FoodItems/${id}`, {
      params: { hardDeleteIfNoRelation: hardDelete },
    });
  },
};