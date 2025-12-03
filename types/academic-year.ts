export interface AcademicYearDto {
  yearId: number;
  yearName: string;
  boardingStartDate?: string | null; // <-- Thêm | null
  boardingEndDate?: string | null; // <-- Thêm | null
}

export interface CreateAcademicYearRequest {
  yearName: string;
  boardingStartDate?: string;
  boardingEndDate?: string;
}

export interface UpdateAcademicYearRequest {
  yearName: string;
  boardingStartDate?: string;
  boardingEndDate?: string;
}
