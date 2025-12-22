import { axiosInstance } from "@/lib/axiosInstance";
import { FeedbackDto, WeekMenuDto } from "@/types/parent";

export const menuService = {
  getAllWeekMenus: async (studentId: string): Promise<WeekMenuDto[]> => {
    const res = await axiosInstance.get<WeekMenuDto[]>("/weekly-menu/all", {
      params: { studentId },
    });
    return res.data;
  },

  getMyFeedbacks: async (): Promise<FeedbackDto[]> => {
    const res = await axiosInstance.get<FeedbackDto[]>(
      "/ParentFeedback/my-feedbacks"
    );
    return res.data;
  },

  getWeekMenu: async (
    studentId: string,
    date: string
  ): Promise<WeekMenuDto> => {
    const res = await axiosInstance.get<WeekMenuDto>("/weekly-menu/week-menu", {
      params: { studentId, date },
    });
    return res.data;
  },
};
