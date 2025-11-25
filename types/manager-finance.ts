
export interface SupplierExpenseDto {
  supplier: string;
  total: number;
}

export interface FinanceSummaryDto {
  schoolId: string;
  month: number;
  year: number;
  totalInvoices: number; 
  paidInvoices: number; 
  unpaidInvoices: number;
  totalPurchaseCost: number; 
  supplierBreakdown: SupplierExpenseDto[]; 

  incomeByDate?: { date: string; amount: number }[];
  expenseByCategory?: any[];
  totalIncome?: number; 
  netIncome?: number; 
  totalInvoiceCount?: number;
  totalExpense?: number;
}

export interface InvoiceDto {
  invoiceId: number;
  studentName: string;
  className: string;
  parentName: string;
  amount: number; 
  status: string;
}

export interface InvoiceDetailDto {
  // ... định nghĩa chi tiết hóa đơn
}

export interface PurchaseOrderDto {
  // ... định nghĩa đơn hàng
}
