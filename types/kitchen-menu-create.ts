export interface FoodItemDto {
  foodId: number;
  foodName: string;
  foodType: string;
  imageUrl?: string;
}

export interface MenuTemplateDto {
  menuId: number;
  menuName: string;
  description?: string;
}

export interface CreateScheduleMealRequest {
  weekStart: string; // YYYY-MM-DD
  weekEnd?: string; // YYYY-MM-DD
  dailyMeals: DailyMealRequestDto[];
}

export interface DailyMealRequestDto {
  mealDate: string;
  mealType: string;
  notes?: string;
  foodIds: number[];
}

export interface AiMenuResponse {
  sessionId: number;
  recommendedMain: AiDishDto[];
  recommendedSide: AiDishDto[];
}

export interface AiDishDto {
  food_id: number;
  food_name: string;
  is_main_dish: boolean;
  total_kcal: number;
  score: number;
}
