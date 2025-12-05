import { Student } from "./student";

export type InvoiceDto =  {
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
