export interface ClassDto {
  classId: string;
  className: string;
  schoolName: string;
  wardenId: string;
  wardenName: string;
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
  shift?: string;
}
export interface WardenStats {
  totalClasses: number;
  totalStudents: number;
  totalPresent: number;
  issuesCount: number;
}

export interface StudentDto {
  studentId: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  isActive: boolean;
  parentName?: string;
  parentPhone?: string;
  relationName?: string;
  allergies: string[];
  isAbsent: boolean;
}

export interface AttendanceSummaryDto {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

export interface ClassAttendanceDto {
  classId: string;
  className: string;
  students: StudentAttendanceDto[];
  summary: AttendanceSummaryDto;
}

export interface StudentAttendanceDto {
  studentId: string;
  studentName: string;
  status: string;
  reason?: string;
  createdAt: string;
}

export interface StudentHealthDto {
  studentId: string;
  studentName: string;
  heightCm?: number | null;
  weightKg?: number | null;
  bmi?: number | null;
  bmiCategory?: string | null; // "Underweight", "Normal", "Overweight", "Obese"
  recordDate: string;
}

export interface HealthStats {
  underweight: number;
  normal: number;
  overweight: number;
  obese: number;
}