export interface ManagerOverviewDto {
  totalTeachers: number;
  newTeachers: number;

  totalStudents: number;
  studentGrowth: number;

  totalClasses: number;
  assignedClasses: number;

  monthlyRevenue: number;
  revenueGrowth: number;
}

export interface RecentPurchaseDto {
  purchaseOrderId: number;
  purchaseDate: string;
  supplierName: string;
  itemCount: number;
  totalAmount: number;
  status: string;
}
