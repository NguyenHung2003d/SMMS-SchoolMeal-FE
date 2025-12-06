import { Student } from "./student";

export type Invoice=  {
  invoiceId: number;
  studentId?: string; // Optional because API might not return it in the list
  studentName: string;
  monthNo: number;
  dateFrom: string;
  dateTo: string;
  absentDay: number;
  status: string;
  amountToPay: number; // Correct field name from backend
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