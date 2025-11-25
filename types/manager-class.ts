export interface CreateClassRequest {
  className: string;
  yearId: number;
  teacherId?: number | null
  schoolId?: number; 
}

export interface UpdateClassRequest {
  className: string;
  teacherId?: number | null;
  isActive?: boolean;
}
export interface ClassDto {
  classId: string; 
  className: string;
  schoolId: number;
  yearId: number;
  teacherId?: number | null;
  teacherName: string; 
  isActive: boolean;
  createdAt: string;
}

export interface TeacherSimpleDto {
  teacherId: number;
  fullName: string;
}

export interface TeacherStatusResponse {
  teachersWithClass: TeacherSimpleDto[];
  teachersWithoutClass: TeacherSimpleDto[];
}