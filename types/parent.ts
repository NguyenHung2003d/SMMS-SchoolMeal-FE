import { ChangeEvent, FormEvent } from "react";

export interface ParentAccountDto {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  avatarUrl: string;
  dateOfBirth: string | null;
}

export interface FeedbackDto {
  feedbackId: number;
  senderId: string;
  rating: number | null;
  content: string | null;
  dailyMealId: number | null;
  createdAt: string;
}

export type ParentInfoFormProps = {
  parentInfo: ParentAccountDto;
  isSaving: boolean;
  onInfoChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onAvatarChange: (file: File) => void;
};
export type ParentInfoDisplayProps = {
  parentInfo: ParentAccountDto;
  onEditClick: () => void;
};

export type UpdatedParentInfoFormProps = ParentInfoFormProps & {
  onCancel: () => void;
};

export interface AttendanceRequestDto {
  studentId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface AttendanceResponseDto {
  attendanceId: number;
  studentId: string;
  studentName: string;
  absentDate: string;
  reason: string;
  notifiedBy: string;
  createdAt: string;
}
import { Student } from "./student";

export type StudentBMIResultDto = {
  studentId: string;
  studentName: string;
  academicYear: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiStatus: string;
  recordAt: string; // DateTime trả về chuỗi
};

export type HealthPoint = {
  month: string; // "T6", "T7", ...
  height: number; // cm
  weight: number; // kg
  bmi: number; // chỉ số BMI
};
export interface WeekOptionDto {
  scheduleMealId: number;
  weekNo: number;
  yearNo: number;
  weekStart: string;
  weekEnd: string;
  status: string;

  ScheduleMealId?: number;
  WeekNo?: number;
  YearNo?: number;
  WeekStart?: string;
  WeekEnd?: string;
  Status?: string;
}

export interface StudentImageDto {
  imageId: string;
  imageUrl: string;
  caption?: string;
  takenAt?: string;
  createdAt: string;
}

export interface MenuFoodItemDto {
  foodId: number;
  foodName: string;
  foodType: string;
  imageUrl: string;
  foodDesc: string;
  isAllergenic: boolean;
  allergenicNames: string[];

  FoodId?: number;
  FoodName?: string;
  FoodType?: string;
  ImageUrl?: string;
  FoodDesc?: string;
  IsAllergenic?: boolean;
  AllergenicNames?: string[];
}

export interface DayMenuDto {
  dailyMealId: number;
  mealDate: string;
  mealType: string;
  notes: string;

  items?: MenuFoodItemDto[];
  foods?: MenuFoodItemDto[];

  DailyMealId?: number;
  MealDate?: string;
  MealType?: string;
  Notes?: string;
  Items?: MenuFoodItemDto[];
  Foods?: MenuFoodItemDto[];

  date?: string;
}

export interface WeekMenuDto {
  schoolId: string;
  weekNo: number;
  yearNo: number;
  weekStart: string;
  weekEnd: string;
  status: string;
  notes: string;
  days: DayMenuDto[];

  SchoolId?: string;
  WeekNo?: number;
  YearNo?: number;
  StartDate?: string;
  EndDate?: string;
  Status?: string;
  Notes?: string;
  Days?: DayMenuDto[];
}

export interface HealthStatsProps {
  currentHealth: StudentBMIResultDto | null;
}

export interface WeekSelectorProps {
  availableWeeks: WeekOptionDto[];
  selectedDateInWeek: string;
  onSelectDate: (date: string) => void;
}

export interface DailyMenuCardProps {
  date: string;
  meal: DayMenuDto | undefined;
  onOpenModal: (meal: DayMenuDto) => void;
}

export interface MealDetailModalProps {
  selectedMeal: DayMenuDto;
  onClose: () => void;
  onSuccess?: () => void;
  existingFeedback?: FeedbackDto | null;
}
