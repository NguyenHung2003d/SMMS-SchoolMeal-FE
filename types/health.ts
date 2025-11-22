import { Student } from "./student";

export type StudentBMIResultDto = {
  studentId: string;
  studentName: string;
  academicYear: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiStatus: string;
  recordAt: string; // DateTime trả về chuỗi
};

export type HealthPoint = {
  month: string; // "T6", "T7", ...
  height: number; // cm
  weight: number; // kg
  bmi: number; // chỉ số BMI
};

export type TrackBMIProps = {
  selectedChild: Student | null;
};