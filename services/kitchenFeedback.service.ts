import { axiosInstance } from "@/lib/axiosInstance";
import {
  FeedbackDto,
  FeedbackDetailDto,
  FeedbackSearchParams,
} from "@/types/kitchen-feedback";

export const kitchenFeedbackService = {
  searchFeedbacks: async (
    params?: FeedbackSearchParams
  ): Promise<FeedbackDto[]> => {
    const res = await axiosInstance.get<FeedbackDto[]>("/Feedbacks", {
      params: params,
    });
    return res.data;
  },

  getFeedbackById: async (id: number): Promise<FeedbackDetailDto> => {
    const res = await axiosInstance.get<FeedbackDetailDto>(`/Feedbacks/${id}`);
    return res.data;
  },
};
