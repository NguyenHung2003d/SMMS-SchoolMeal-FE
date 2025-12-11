export interface CreateClassRequest {
  className: string;
  yearId: number;
  teacherId?: string | null
  schoolId?: string; 
}

export interface UpdateClassRequest {
  className: string;
  teacherId?: string | null;
  isActive?: boolean;
}
export interface ClassDto {
  classId: string; 
  className: string;
  schoolId: number;
  yearId: number;
  teacherId?: string | null;
  teacherName: string; 
  isActive: boolean;
  createdAt: string;
}

export interface TeacherSimpleDto {
  teacherId: number;
  fullName: string;
}