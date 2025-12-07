export interface ParentStudentDetailDto {
  fullName: string;
  gender: string;
  dateOfBirth?: string;
  classId?: string;
  className?: string;
}

export interface ParentAccountDto {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  schoolName: string;
  relationName: string;
  children: ParentStudentDetailDto[];
  childrenNames?: string[];
  className?: string;
  paymentStatus: "Đã thanh toán" | "Chưa thanh toán" | "Chưa tạo hóa đơn";
}
export interface CreateChildDto {
  fullName: string;
  gender: string;
  dateOfBirth?: string;
  classId: string;
}
export interface CreateParentRequest {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  children: CreateChildDto[];
  schoolId?: string;
  relationName?: string;
}
export interface UpdateParentRequest {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  gender?: string;
  relationName: string;
  children: CreateChildDto[];
  updatedBy?: string;
}

export interface ParentDetailDto extends ParentAccountDto {}
