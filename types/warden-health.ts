export interface HealthRecord {
  recordId?: string;
  studentId: string;
  studentName: string;
  heightCm: number | null;
  weightKg: number | null;
  bmi: number | null;
  bmiCategory: string | null;
  recordDate: string;
}

export interface HealthFormData {
  heightCm: string;
  weightKg: string;
  recordDate: string;
}