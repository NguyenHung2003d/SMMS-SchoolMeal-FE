// types/paymentTypes.ts

export interface SchoolPaymentSettingDto {
  settingId: number;
  schoolId: string;
  fromMonth: number; // byte bên C# -> number bên TS
  toMonth: number;   // byte bên C# -> number bên TS
  totalAmount: number; // decimal bên C# -> number bên TS
  note?: string;
  isActive: boolean;
  createdAt: string; // DateTime
}

export interface CreateSchoolPaymentSettingRequest {
  schoolId: string;
  fromMonth: number;
  toMonth: number;
  totalAmount: number;
  note?: string;
}

export interface UpdateSchoolPaymentSettingRequest {
  fromMonth: number;
  toMonth: number;
  totalAmount: number;
  note?: string;
  isActive: boolean;
}