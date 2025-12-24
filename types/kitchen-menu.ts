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

export interface DisplayFoodItem {
  foodName: string;
  imageUrl?: string;
  ingredientNames: string[];
}

export interface DayMenuRow {
  dailyMealId: number;
  dateStr: string;
  dayName: string;
  mainDishes: DisplayFoodItem[];
  sideDishes: DisplayFoodItem[];
}

export interface DailyMealActualIngredient {
  ingredientId: number;
  ingredientName: string;
  actualQtyGram: number;
  estimatedQtyGram: number;
  notes: string | null;
}

export interface DailyMealDetailPopupDto {
  dailyMealId: number;
  mealDate: string;
  evidences: any[];
  actualIngredients: DailyMealActualIngredient[];
}
