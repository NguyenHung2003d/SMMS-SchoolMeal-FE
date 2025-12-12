export interface SchoolDTO {
  schoolId: string;
  schoolName: string;
  contactEmail?: string;
  hotline?: string;
  schoolAddress?: string;
  isActive: boolean;
  createdAt: string;
  studentCount: number;
}

export interface CreateSchoolDto {
  schoolName: string;
  contactEmail?: string;
  hotline?: string;
  schoolAddress?: string;
  isActive: boolean;
}

export interface UpdateSchoolDto {
  schoolName: string;
  contactEmail?: string;
  hotline?: string;
  schoolAddress?: string;
  isActive: boolean;
}

export interface UpdateSchoolRevenueDto {
  revenueId: number;
  schoolId: string; 
  revenueDate: string;
  revenueAmount: number;
  contractCode: string;
  contractNote?: string;
}

export interface SchoolRevenue {
  schoolRevenueId: number;
  schoolId: string;
  contractCode: string;
  revenueAmount: number;
  revenueDate: string; // ISO string
  contractNote?: string;
  contractFileUrl?: string; // URL ảnh/file trên Cloudinary
  isActive: boolean;
  createdAt?: string;
}