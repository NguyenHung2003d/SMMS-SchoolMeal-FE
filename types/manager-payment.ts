export interface SchoolPaymentSettingDto {
  settingId: number;
  schoolId: string;
  fromMonth: number;
  note?: string;
  isActive: boolean;
  createdAt: string;
  mealPricePerDay: number;
  totalAmount: number;
}

export interface CreateSchoolPaymentSettingRequest {
  fromMonth: number;
  note?: string;
  mealPricePerDay: number;
}

export interface UpdateSchoolPaymentSettingRequest {
  fromMonth: number;
  mealPricePerDay: number;
  note?: string;
  isActive: boolean;
}
