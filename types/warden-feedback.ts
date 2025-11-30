export interface FeedbackDto {
  feedbackId: number;
  title: string;       
  content: string;
  senderName: string;
  targetRef?: string; 
  targetType?: string;
  createdAt: string;
  dailyMealId?: number;
  status?: string;    
  replyCount?: number;
}

export interface CreateFeedbackRequest {
  title: string;
  content: string;
  targetType: string;
  targetRef?: string;
  wardenId: string;
  severity?: string; // Backend chưa xử lý, nhưng vẫn gửi lên nếu DTO cho phép
}