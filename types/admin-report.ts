export interface ReportFilterDto {
  reportType?: string;
  scope?: string;
  schoolId?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface UserReportDto {
  roleName: string;
  schoolName?: string;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface FinanceReportFilterDto {
  schoolId?: string | null;
  scope?: string;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface FinanceReportDto {
  schoolName: string;
  totalRevenue: number;
  revenueCount: number;
}
