import { Student } from "./student";

export type InvoiceDto = {
  invoiceId: number;
  studentId: number;
  studentName: string;
  monthNo: number;
  dateFrom: string;
  dateTo: string;
  absentDay: number;
  status: string;
  totalAmount?: number;
  pricePerDay?: number;
};

export type ViewInvoiceProps = {
  selectedChild: Student | null;
};
