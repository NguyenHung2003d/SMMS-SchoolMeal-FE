export interface WeekOptionDto {
  // === Trường hợp camelCase (React/JSON chuẩn) ===
  scheduleMealId: number;
  weekNo: number;
  yearNo: number;
  weekStart: string;
  weekEnd: string;
  status: string;

  // === Trường hợp PascalCase (C# Default) ===
  // Thêm dấu ? để không bắt buộc, nhưng nếu API trả về vẫn hứng được
  ScheduleMealId?: number;
  WeekNo?: number;
  YearNo?: number;
  WeekStart?: string;
  WeekEnd?: string;
  Status?: string;
}

export interface MenuFoodItemDto {
  // === camelCase ===
  foodId: number;
  foodName: string;
  foodType: string;
  imageUrl: string;
  foodDesc: string;
  isAllergenic: boolean;
  allergenicNames: string[];

  // === PascalCase Fallback ===
  FoodId?: number;
  FoodName?: string;
  FoodType?: string;
  ImageUrl?: string;
  FoodDesc?: string;
  IsAllergenic?: boolean;
  AllergenicNames?: string[];
}

export interface DayMenuDto {
  // === camelCase ===
  dailyMealId: number;
  mealDate: string; // API trả về cái này (theo log của bạn)
  mealType: string;
  notes: string;
  
  // Quan trọng: API của bạn trả về 'items' thay vì 'foods' trong log
  items?: MenuFoodItemDto[]; 
  foods?: MenuFoodItemDto[]; // Giữ lại để tương thích ngược

  // === PascalCase Fallback ===
  DailyMealId?: number;
  MealDate?: string;
  MealType?: string;
  Notes?: string;
  Items?: MenuFoodItemDto[];
  Foods?: MenuFoodItemDto[];

  // === Hỗ trợ code cũ ===
  date?: string; // Một số chỗ trong code cũ frontend dùng 'date'
}

export interface WeekMenuDto {
  // === camelCase ===
  schoolId: string;
  weekNo: number;
  yearNo: number;
  weekStart: string;
  weekEnd: string;
  status: string;
  notes: string;
  days: DayMenuDto[];

  // === PascalCase Fallback ===
  SchoolId?: string;
  WeekNo?: number;
  YearNo?: number;
  StartDate?: string;
  EndDate?: string;
  Status?: string;
  Notes?: string;
  Days?: DayMenuDto[]; // API C# có thể trả về Days viết hoa
}

// Helper type nếu cần dùng cho UI
export interface DailyMenuDto {
  date: string;
  dayOfWeek: string;
}