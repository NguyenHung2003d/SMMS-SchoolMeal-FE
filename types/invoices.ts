import { Student } from "./student";

export type Invoice = {
  invoiceId: number;
  studentId?: string;
  studentName: string,
  schoolName: string
  className: string
  monthNo: number;
  dateFrom: string;
  dateTo: string;
  absentDay: number;
  status: string;
  amountToPay: number;
  settlementBankCode: string;
  settlementAccountNo: string;
  settlementAccountName: string;

};

export interface InvoiceSummary {
  invoiceId: number;
  monthNo: number;
  dateFrom: string;
  status: string;
}

export interface PayOSLinkResponse {
  paymentId: number;
  checkoutUrl: string;
  qrCode: string;
  paymentLinkId: string;
}

export type ViewInvoiceProps = {
  selectedChild: Student | null;
};

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
  year?: number;
  status?: string;
}
