export interface AttendanceRequestDto {
  studentId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface AttendanceResponseDto {
  attendanceId: number;
  studentId: string;
  studentName: string;
  absentDate: string;
  reason: string;
  notifiedBy: string;
  createdAt: string;
}

export interface SelectIconProps {
  selectedChild: {
    studentId: string;
    name: string;
  } | null;
}
