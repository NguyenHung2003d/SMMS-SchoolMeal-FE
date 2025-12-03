import { axiosInstance } from "@/lib/axiosInstance";
import { WeeklyScheduleDto } from "@/types/kitchen-menu";

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
};
