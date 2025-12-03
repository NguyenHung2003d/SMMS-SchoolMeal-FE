export interface CreateSchoolRevenueDto {
  schoolId: string;
  revenueDate: string;
  revenueAmount: number;
  contractCode: string;
  contractNote?: string;
  contractFile?: File;
}

export interface SchoolRevenueDto {
  revenueId: number;
  schoolId: string;
  revenueDate: string;
  revenueAmount: number;
  contractCode: string;
  contractNote?: string;
  contractFileUrl?: string;
}
