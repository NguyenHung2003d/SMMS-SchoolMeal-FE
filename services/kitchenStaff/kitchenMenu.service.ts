import { axiosInstance } from "@/lib/axiosInstance";
import { WeeklyScheduleDto } from "@/types/kitchen-menu";
import {
  AiMenuResponse,
  CreateScheduleMealRequest,
  FoodItemDto,
  MenuTemplateDto,
} from "@/types/kitchen-menu-create";

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export const kitchenMenuService = {
  getAllSchedules: async (): Promise<WeeklyScheduleDto[]> => {
    try {
      const res = await axiosInstance.get<PagedResult<WeeklyScheduleDto>>(
        "/meal/ScheduleMeals",
        {
          params: {
            GetAll: true,
          },
        }
      );
      return res.data.items || [];
    } catch (error) {
      console.error("Error getting all schedules:", error);
      return [];
    }
  },

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

  getFoodItemsByMainDish: async (isMainDish: boolean, keyword: string = "") => {
    const response = await axiosInstance.get<FoodItemDto[]>(
      "/nutrition/FoodItems/by-main-dish",
      {
        params: {
          isMainDish,
          keyword,
          includeInactive: false,
        },
      }
    );
    return response.data;
  },

  getAllMenus: async () => {
    const res = await axiosInstance.get("/Menus");
    return res.data;
  },

  getMenuDetail: async (id: number) => {
    const res = await axiosInstance.get(`/Menus/${id}`);
    return res.data;
  },

  getDailyMealDetail: async (dailyMealId: number) => {
    const res = await axiosInstance.get(
      `/meal/daily-meals/${dailyMealId}/detail`
    );
    return res.data;
  },

  uploadEvidence: async (dailyMealId: number, file: File) => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("Caption", "Ảnh mẫu thực phẩm");

    const response = await axiosInstance.post(
      `/meal/daily-meals/${dailyMealId}/evidences`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  deleteEvidence: async (evidenceId: number) => {
    await axiosInstance.delete(`/meal/daily-meals/evidences/${evidenceId}`);
  },

  updateActualIngredients: async (dailyMealId: number, items: any[]) => {
    const response = await axiosInstance.put(
      `/meal/daily-meals/${dailyMealId}/actual-ingredients`,
      {
        items: items,
      }
    );
    return response.data;
  },

  consumeInventory: async (scheduleMealId: number) => {
    const response = await axiosInstance.post(
      `/inventory/consume-from-schedule/${scheduleMealId}`
    );
    return response.data;
  },

  checkOffDates: async (fromDate: string, toDate: string) => {
    const response = await axiosInstance.get(`/meal/ScheduleMeals/check`, {
      params: { fromDate, toDate },
    });
    return response.data;
  },
};
