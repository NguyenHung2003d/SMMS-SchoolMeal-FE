import { axiosInstance } from "@/lib/axiosInstance";
import { WeeklyScheduleDto } from "@/types/kitchen-menu";
import {
  AiMenuResponse,
  CreateScheduleMealRequest,
  FoodItemDto,
  MenuTemplateDto,
} from "@/types/kitchen-menu-create";

export const kitchenMenuService = {
  getWeekMenuByDate: async (date: Date): Promise<WeeklyScheduleDto | null> => {
    try {
      const dateStr = date.toISOString().split("T")[0];

      const res = await axiosInstance.get<WeeklyScheduleDto>(
        `/meal/ScheduleMeals/week-of`,
        { params: { date: dateStr } }
      );
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getFoodItems: async (keyword?: string): Promise<FoodItemDto[]> => {
    const params = keyword ? { keyword } : {};
    const res = await axiosInstance.get("/nutrition/FoodItems", { params });
    return res.data;
  },

  getMenuTemplates: async (): Promise<MenuTemplateDto[]> => {
    try {
      const res = await axiosInstance.get("/Menus");
      return res.data;
    } catch {
      return [];
    }
  },

  getMenuTemplateDetail: async (menuId: number) => {
    const res = await axiosInstance.get(`/Menus/${menuId}`);
    return res.data;
  },

  createSchedule: async (payload: CreateScheduleMealRequest) => {
    const res = await axiosInstance.post("/meal/ScheduleMeals", payload);
    return res.data;
  },

  getAiSuggestion: async (requirements: any): Promise<AiMenuResponse> => {
    const payload = {
      MainIngredientIds: requirements.mainIngredients || [],
      SideIngredientIds: requirements.sideIngredients || [],
      AvoidAllergenIds: requirements.avoidAllergens || [],
      MaxMainKcal: requirements.maxMainKcal || 650,
      MaxSideKcal: requirements.maxSideKcal || 350,
      TopKMain: 5,
      TopKSide: 5,
    };
    const res = await axiosInstance.post("/AiMenu/recommend", payload);
    return res.data;
  },

  createPurchasePlanFromSchedule: async (scheduleMealId: number) => {
    const response = await axiosInstance.post(
      `/purchase-plans/from-schedule?scheduleMealId=${scheduleMealId}`
    );
    return response.data;
  },
};
