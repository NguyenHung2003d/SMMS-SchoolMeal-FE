export interface TodaySummaryDto {
  totalDailyMealsToday: number;
  totalDishesToday: number;
  absenceCountToday: number;
  feedbackCountToday: number;
  lowStockItemCount: number;
  nearExpiryItemCount: number;
  openPurchaseOrderCount: number;
  avgDishesPerMealToday: number;
}

export interface AbsenceRequestShortDto {
  attendanceId: number;
  absentDate: string;
  studentName: string;
  className: string;
  reasonShort?: string;
  notifiedByName?: string;
  createdAt: string;
}

export interface FeedbackShortDto {
  feedbackId: number;
  createdAt: string;
  mealDate: string;
  mealType: string;
  senderName: string;
  contentPreview: string;
}

export interface InventoryAlertShortDto {
  itemId: number;
  ingredientName: string;
  itemName: string;
  quantityGram: number;
  expirationDate?: string | null;
  alertType: string;
}

export interface KitchenDashboardDto {
  todaySummary: TodaySummaryDto;
  absenceRequests: AbsenceRequestShortDto[];
  recentFeedbacks: FeedbackShortDto[];
  inventoryAlerts: InventoryAlertShortDto[];
}
