export interface ClassDto {
  classId: string;
  className: string;
  schoolId: string;
  yearId: number;
  teacherId?: string;
  teacherName: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateClassRequest {
  className: string;
  yearId: number;
  teacherId?: string;
  schoolId?: string; 
}

export interface UpdateClassRequest {
  className?: string;
  teacherId?: string;
  isActive?: boolean;
}

export interface TeacherDto {
  teacherId: string;
  fullName: string;
}

export interface TeacherAssignmentStatus {
  teachersWithClass: TeacherDto[];
  teachersWithoutClass: TeacherDto[];
}