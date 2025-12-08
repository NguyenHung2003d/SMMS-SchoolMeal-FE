"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Building2, Calendar, Receipt, User } from "lucide-react";
import toast from "react-hot-toast";

import { axiosInstance } from "@/lib/axiosInstance";
import { formatCurrency, formatDate } from "@/helpers";
import { Invoice, InvoiceSummary } from "@/types/invoices";
import { useSelectedStudent } from "@/context/SelectedChildContext";

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
          toast.error("Không thể tải danh sách hóa đơn.");
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
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
        toast.error("Không thể tải chi tiết hóa đơn này.");
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
          {/* Dropdown chọn hóa đơn */}
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-2xl flex items-center gap-2">
                      Tháng {invoiceDetail.monthNo}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      Mã hóa đơn: #{invoiceDetail.invoiceId}
                    </p>
                  </div>
                  <div className="text-right bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <p className="text-xs font-medium text-blue-100 uppercase">
                      Học sinh
                    </p>
                    <p className="font-bold text-lg">
                      {invoiceDetail.studentName}
                    </p>
                    <p className="text-xs text-blue-100">
                      Lớp: {invoiceDetail.className}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Thông tin thời gian và ngày nghỉ */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                      <Calendar size={18} /> Kỳ thanh toán
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Từ ngày:</span>
                        <span className="font-medium">
                          {formatDate(invoiceDetail.dateFrom)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đến ngày:</span>
                        <span className="font-medium">
                          {formatDate(invoiceDetail.dateTo)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
                      <User size={18} /> Điểm danh
                    </h4>
                    <div className="flex justify-between items-center text-sm text-gray-700 mt-2">
                      <span>Số ngày nghỉ (có phép):</span>
                      <span className="font-bold text-lg text-orange-600">
                        {invoiceDetail.absentDay} ngày
                      </span>
                    </div>
                    <p className="text-xs text-orange-600/70 mt-2 italic">
                      * Đã được trừ vào tổng tiền
                    </p>
                  </div>
                </div>

                {/* Thông tin trường học (Lấy từ API chi tiết) */}
                <div className="border rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Building2 size={18} /> Thông tin chuyển khoản (Trường)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Trường học</p>
                      <p className="font-medium text-gray-900">
                        {invoiceDetail.schoolName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ngân hàng</p>
                      <p className="font-medium text-gray-900">
                        {invoiceDetail.settlementBankCode}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Số tài khoản thụ hưởng</p>
                      <p className="font-mono font-bold text-gray-900 text-lg tracking-wide">
                        {invoiceDetail.settlementAccountNo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phần tổng tiền */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-xl gap-4">
                  <div className="text-center md:text-left">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${
                        invoiceDetail.status === "Paid" ||
                        invoiceDetail.status === "Đã thanh toán"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {invoiceDetail.status === "Paid" ||
                      invoiceDetail.status === "Đã thanh toán"
                        ? "✓ ĐÃ THANH TOÁN"
                        : "⏳ CHƯA THANH TOÁN"}
                    </span>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-gray-500 text-sm mb-1">
                      Tổng tiền phải đóng
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(invoiceDetail.amountToPay)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
