export interface FeedbackDto {
  feedbackId: number;
  title: string; // [ClassName] + [TeacherName] + [Date]
  senderName: string;
  content: string;
  targetType?: string; // "kitchen" / "parents"
  targetRef?: string; // Tên học sinh (nếu có)
  createdAt: string; // ISO Date string
  dailyMealId?: number;
}

export interface FeedbackSearchParams {
  keyword?: string;
  targetType?: string;
  fromCreatedAt?: string;
  toCreatedAt?: string;
  sortBy?: string;
  sortDesc?: boolean;
}
