export interface CreateSchoolRevenueDto {
  schoolId: string;
  revenueDate: string;
  revenueAmount: number;
  contractCode: string;
  contractNote?: string;
  contractFile?: File;
}
