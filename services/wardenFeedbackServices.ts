import { axiosInstance } from "@/lib/axiosInstance";
import { FeedbackDto, CreateFeedbackRequest } from "@/types/warden";

export const wardenFeedbackService = {
  getFeedbacks: async (wardenId: string): Promise<FeedbackDto[]> => {
    try {
      const res = await axiosInstance.get(`/WardensFeedback/${wardenId}/list`);
      return res.data.data || [];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },

  createFeedback: async (data: CreateFeedbackRequest): Promise<FeedbackDto> => {
    const res = await axiosInstance.post(`/WardensFeedback/create`, data);
    return res.data.data;
  },
};
