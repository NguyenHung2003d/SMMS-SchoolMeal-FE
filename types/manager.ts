export interface ManagerOverviewDto {
  teacherCount: number;

  studentCount: number;
  studentGrowth: number;

  classCount: number;
  assignedClasses: number;

  financeThisMonth: number;
  financeChangePercent: number;
}
export interface RecentPurchaseDto {
  orderId: number;
  supplierName: string;
  orderDate: string;
  status: string;
  note?: string;
  totalAmount: number;
}

export interface StaffDto {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatarUrl?: string;
  createdDate?: string;
  password?: string;
}

export interface CreateAccountRequest {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  schoolId?: string
}
