export interface AdminDashboardOverview {
  totalSchools: number;
  totalStudents: number;
  
  currentMonthRevenue: number;
  previousMonthRevenue: number;

  schoolGrowth: number;
  studentGrowth: number;
  revenueGrowth: number;

}