export interface ParentAccountDto {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  schoolName: string;
  childrenNames: string[];
  className?: string;
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
