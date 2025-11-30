// --- Food Item & Ingredients ---
export interface FoodItemIngredient {
  ingredientId: number;
  quantityGram: number;
}

export interface FoodItem {
  foodId: number;
  foodName: string;
  foodDesc?: string;
  foodType?: string; // "Món mặn", "Canh", "Tráng miệng"
  isMainDish: boolean;
  isActive: boolean;
  schoolId: string; // Guid
  imageUrl?: string;
  ingredients?: FoodItemIngredient[];
}

export interface UpdateFoodItemRequest {
  foodId: number;
  foodName: string;
  foodType?: string;
  foodDesc?: string;
  imageUrl?: string;
  isMainDish: boolean;
  isActive: boolean;
  schoolId: string;
  ingredients?: FoodItemIngredient[];
}

// --- Menu Structure ---

export interface MenuFoodItem {
  dailyMealId: number;
  foodId: number;
  sortOrder?: number;
  food?: FoodItem; // Include thông tin món ăn để hiển thị tên
}

export interface DailyMeal {
  dailyMealId: number;
  scheduleMealId: number;
  mealDate: string; // "yyyy-MM-dd"
  mealType: string; // "Bữa trưa", "Bữa phụ"
  notes?: string;
  // Danh sách các món ăn trong bữa này
  menuFoodItems?: MenuFoodItem[];
}

export interface ScheduleMeal {
  scheduleMealId: number;
  weekStart: string; // "yyyy-MM-dd"
  weekEnd: string; // "yyyy-MM-dd"
  weekNo: number;
  yearNo: number;
  status: string; // 'Draft', 'Published', 'Archived'
  notes?: string;
}
