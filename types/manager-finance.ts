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

export interface PaymentDto {
  paymentId: number;
  expectedAmount: number; // Số tiền cần đóng
  paidAmount: number; // Số tiền thực đóng
  paymentStatus: string;
  method?: string;
  paidAt?: string; // DateTime nullable
}

export interface InvoiceDetailDto {
  invoiceId: number;
  studentName: string;
  className: string;
  monthNo: number;
  dateFrom: string;
  dateTo: string;
  status: string;
  payments: PaymentDto[];
}

export interface PurchaseOrderDto {
  orderId: number;
  orderDate: string;
  supplierName: string;
  totalAmount: number;
  itemsCount?: number;
  purchaseOrderStatus?: string;
}
