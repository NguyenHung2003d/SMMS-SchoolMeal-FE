export interface Invoice {
  invoiceId: number;
  invoiceCode: string;
  studentName: string;
  monthNo: number;
  dateFrom: string;
  dateTo: string;
  absentDay: number;
  holiday: number;
  status: string;
  amountToPay: number;
  totalPrice: number;
  mealPricePerDay: number;
  amountTotal: number;
  mealPricePerDayLastMonth: number;
}
export interface InvoiceDetails extends Invoice {
  className: string;
  schoolName: string;
  mealPricePerDay: number;
  totalMealLastMonth: number;
  amountTotal: number;
  settlementBankCode: string;
  settlementAccountNo: string;
  settlementAccountName: string;
}

export interface PayOSLinkResponse {
  paymentId: number;
  checkoutUrl: string;
  qrCode: string;
  paymentLinkId: string;
}

export interface InvoiceListResponse {
  count: number;
  data: Invoice[];
}

export interface GenerateInvoiceRequest {
  dateFrom: string;
  dateTo: string;
  skipExisting: boolean;
}

export interface UpdateInvoiceRequest {
  dateFrom: string;
  dateTo: string;
  absentDay: number;
  status: string;
}

export interface InvoiceFilter {
  monthNo?: number;
  year: number;
  status?: string;
  classId: string;
  studentName: string;
}
