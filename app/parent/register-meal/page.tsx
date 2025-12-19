"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { billService } from "@/services/bill.service";
import { Invoice } from "@/types/invoices";
import { Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useSelectedStudent } from "@/context/SelectedChildContext";
import {
  EmptyInvoicesView,
  ErrorView,
  LoadingView,
  NoStudentSelectedView,
} from "@/components/parents/register-meal/StateViews";
import { StudentHeader } from "@/components/parents/register-meal/StudentHeader";
import { InvoiceList } from "@/components/parents/register-meal/InvoiceList";
import { PaymentSidebar } from "@/components/parents/register-meal/PaymentSidebar";

export default function RegisterMeal() {
  const router = useRouter();
  const { selectedStudent } = useSelectedStudent();

  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudent?.studentId) {
      fetchInvoices(selectedStudent.studentId);
    } else {
      setUnpaidInvoices([]);
      setSelectedInvoice(null);
    }
  }, [selectedStudent]);

  const fetchInvoices = async (studentId: string) => {
    setIsLoadingInvoice(true);
    setError(null);
    try {
      const invoices = await billService.getUnpaidInvoices(studentId);
      if (invoices && invoices.length > 0) {
        setUnpaidInvoices(invoices);
        setSelectedInvoice(invoices[0]);
      } else {
        setUnpaidInvoices([]);
        setSelectedInvoice(null);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setUnpaidInvoices([]);
        setSelectedInvoice(null);
      } else {
        console.error(err);
        setError("Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.");
        toast.error("Lỗi kết nối server.");
      }
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const handleViewDetail = () => {
    if (!selectedInvoice || !selectedStudent) return;
    router.push(
      `/parent/invoices/${selectedInvoice.invoiceId}?studentId=${selectedStudent.studentId}`
    );
  };

  return (
    <div className="mx-auto space-y-6 pb-10 max-w-6xl transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Thanh toán tiền ăn trưa
          </h2>
          <p className="text-sm text-gray-500">
            Xem và thanh toán các khoản phí chưa đóng
          </p>
        </div>
      </div>

      {!selectedStudent ? (
        <NoStudentSelectedView />
      ) : (
        <div className="space-y-6">
          <StudentHeader
            student={selectedStudent}
            invoiceCount={unpaidInvoices.length}
          />

          {isLoadingInvoice ? (
            <LoadingView />
          ) : error ? (
            <ErrorView
              message={error}
              onRetry={() => fetchInvoices(selectedStudent.studentId)}
            />
          ) : unpaidInvoices.length === 0 ? (
            <EmptyInvoicesView />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <InvoiceList
                  invoices={unpaidInvoices}
                  selectedInvoiceId={selectedInvoice?.invoiceId || null}
                  onSelect={setSelectedInvoice}
                />
              </div>

              <div className="lg:col-span-1">
                <PaymentSidebar
                  selectedInvoice={selectedInvoice}
                  onPay={handleViewDetail}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
