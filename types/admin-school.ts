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
