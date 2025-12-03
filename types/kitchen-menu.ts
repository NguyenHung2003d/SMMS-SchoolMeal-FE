export interface ScheduledFoodItemDto {
  foodId: number;
  foodName: string;
  foodType: string;
  isMainDish: boolean;
  imageUrl?: string;
  foodDesc?: string;
  sortOrder?: number;
}

export interface DailyMealDto {
  dailyMealId: number;
  mealDate: string;
  mealType: string;
  notes?: string;
  foodItems: ScheduledFoodItemDto[];
}

export interface WeeklyScheduleDto {
  scheduleMealId: number;
  weekStart: string;
  weekEnd: string;
  weekNo: number;
  yearNo: number;
  status: string;
  notes?: string;
  dailyMeals: DailyMealDto[];
}
