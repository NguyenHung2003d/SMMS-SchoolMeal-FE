export interface FeedbackDto {
  feedbackId: number;
  title: string; // [ClassName] + [TeacherName] + [Date]
  senderName: string;
  content: string;
  targetType?: string; // "kitchen" | "parents"
  targetRef?: string; // studentName
  createdAt: string; // DateTime
  dailyMealId?: number;
}

export interface FeedbackDetailDto {
  feedbackId: number;
  senderId: string; // Guid
  targetType?: string;
  targetRef?: string;
  content: string;
  createdAt: string;
  dailyMealId?: number;
}

export interface FeedbackSearchParams {
  keyword?: string;
  fromCreatedAt?: string;
  toCreatedAt?: string;
  sortBy?: string;
  sortDesc?: boolean;
  pageIndex?: number;
  pageSize?: number;
}
