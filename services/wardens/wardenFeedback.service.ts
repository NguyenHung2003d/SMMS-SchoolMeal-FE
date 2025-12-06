import { axiosInstance } from "@/lib/axiosInstance";
import { CreateFeedbackRequest, FeedbackDto } from "@/types/warden-feedback";

export const wardenFeedbackService = {
  getFeedbacks: async (): Promise<FeedbackDto[]> => {
    const response = await axiosInstance.get(`/WardensFeedback/list`);
    return response.data.data || [];
  },

  createFeedback: async (data: CreateFeedbackRequest): Promise<FeedbackDto> => {
    const response = await axiosInstance.post(`/WardensFeedback/create`, data);
    return response.data.data;
  },

  updateFeedback: async (
    feedbackId: number,
    data: CreateFeedbackRequest
  ): Promise<FeedbackDto> => {
    console.log("DEBUG ID:", feedbackId, typeof feedbackId);

    const id = parseInt(feedbackId.toString());

    const response = await axiosInstance.put(`/WardensFeedback/${id}`, data);
    return response.data;
  },

  deleteFeedback: async (feedbackId: number): Promise<void> => {
    await axiosInstance.delete(`/WardensFeedback/${feedbackId}`);
  },
};
