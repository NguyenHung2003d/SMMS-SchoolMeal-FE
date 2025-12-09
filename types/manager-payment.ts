export interface SchoolPaymentSettingDto {
  settingId: number;
  schoolId: string;
  fromMonth: number; // byte bên C# -> number bên TS
  toMonth: number; // byte bên C# -> number bên TS
  totalAmount: number; // decimal bên C# -> number bên TS
  note?: string;
  isActive: boolean;
  createdAt: string;
  mealPricePerDay: number;
}

export interface CreateSchoolPaymentSettingRequest {
  fromMonth: number;
  toMonth: number;
  totalAmount: number;
  note?: string;
  mealPricePerDay: number;
}

export interface UpdateSchoolPaymentSettingRequest {
  fromMonth: number;
  toMonth: number;
  totalAmount: number;
  mealPricePerDay: number;

  note?: string;
  isActive: boolean;
}
