"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Receipt } from "lucide-react";
import toast from "react-hot-toast";

import { axiosInstance } from "@/lib/axiosInstance";
import { Invoice, InvoiceSummary } from "@/types/invoices";
import { useSelectedStudent } from "@/context/SelectedChildContext";
import { InvoiceDetail } from "@/components/parents/invoice/InvoiceDetail";

export default function InvoicePage() {
  const { selectedStudent } = useSelectedStudent();

  const [invoicesList, setInvoicesList] = useState<InvoiceSummary[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    if (!selectedStudent?.studentId) {
      setInvoicesList([]);
      setSelectedInvoiceId(null);
      setInvoiceDetail(null);
      return;
    }

    const fetchInvoicesList = async () => {
      try {
        setIsListLoading(true);
        const res = await axiosInstance.get<InvoiceSummary[]>(
          "/Invoice/my-invoices",
          {
            params: { studentId: selectedStudent.studentId },
          }
        );
        setInvoicesList(res.data);

        if (res.data && res.data.length > 0) {
          const sorted = [...res.data].sort(
            (a, b) => b.invoiceId - a.invoiceId
          );
          setSelectedInvoiceId(sorted[0].invoiceId);
        } else {
          setSelectedInvoiceId(null);
          setInvoiceDetail(null);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setInvoicesList([]);
          setInvoiceDetail(null);
        } else {
          const serverMessage =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Không thể tải danh sách hóa đơn.";
          toast.error(serverMessage);
        }
      } finally {
        setIsListLoading(false);
      }
    };

    fetchInvoicesList();
  }, [selectedStudent?.studentId]);

  useEffect(() => {
    if (!selectedInvoiceId || !selectedStudent?.studentId) return;

    const fetchDetail = async () => {
      try {
        setIsDetailLoading(true);
        setInvoiceDetail(null);

        const res = await axiosInstance.get<Invoice>(
          `/Invoice/${selectedInvoiceId}`,
          {
            params: { studentId: selectedStudent.studentId },
          }
        );
        setInvoiceDetail(res.data);
      } catch (error: any) {
        console.error("Lỗi lấy chi tiết:", error);
        const serverMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Không thể tải chi tiết hóa đơn này.";
        toast.error(serverMessage);
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedInvoiceId, selectedStudent?.studentId]);

  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tra cứu hóa đơn</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Receipt /> Tra cứu hóa đơn
      </h2>

      {isListLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : invoicesList.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          Chưa có hóa đơn nào cho bé <strong>{selectedStudent.fullName}</strong>
          .
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Chọn kỳ thanh toán
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50"
              value={selectedInvoiceId || ""}
              onChange={(e) => setSelectedInvoiceId(Number(e.target.value))}
            >
              {invoicesList.map((inv) => (
                <option key={inv.invoiceId} value={inv.invoiceId}>
                  Hóa đơn #{inv.invoiceId} - Tháng {inv.monthNo} (
                  {new Date(inv.dateFrom).getFullYear()}) - {inv.status}
                </option>
              ))}
            </select>
          </div>

          {isDetailLoading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
              <span className="text-gray-400 text-sm">
                Đang tải chi tiết...
              </span>
            </div>
          ) : invoiceDetail ? (
            <InvoiceDetail invoice={invoiceDetail} />
          ) : null}
        </div>
      )}
    </div>
  );
}
