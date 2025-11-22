"use client";
import { formatCurrency, formatDateForInput } from "@/helpers";
import { axiosInstance } from "@/lib/axiosInstance";
import { InvoiceDto, ViewInvoiceProps } from "@/types/invoices";
import { Download, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ViewInvoice({ selectedChild }: ViewInvoiceProps) {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!selectedChild?.studentId) return;
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<InvoiceDto[]>(
          "/Invoice/my-invoices"
        );
        setInvoices(res.data);
      } catch (error) {
        console.error("Lỗi tải hóa đơn:", error);
        toast.error("Không thể tải danh sách hóa đơn.");
        // setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [selectedChild?.studentId]);

  const childInvoices = invoices.filter(
    (inv) => inv.studentId === selectedChild?.studentId
  );

  useEffect(() => {
    if (childInvoices.length > 0) {
      const sorted = [...childInvoices].sort(
        (a, b) => b.invoiceId - a.invoiceId
      );
      setSelectedInvoiceId(sorted[0].invoiceId);
    }
  });

  const currentInvoice = childInvoices.find(
    (inv) => inv.invoiceId === selectedInvoiceId
  );

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Xem hóa đơn</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Xem hóa đơn</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : childInvoices.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          Chưa có hóa đơn nào cho bé {selectedChild.fullName}.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Chọn hóa đơn tháng
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
              value={selectedInvoiceId || ""}
              onChange={(e) => setSelectedInvoiceId(Number(e.target.value))}
            >
              {childInvoices.map((inv) => (
                <option key={inv.invoiceId} value={inv.invoiceId}>
                  Tháng {inv.monthNo} - {new Date(inv.dateFrom).getFullYear()} (
                  {inv.status})
                </option>
              ))}
            </select>
          </div>
          {currentInvoice && (
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">
                      Hóa đơn Tháng {currentInvoice.monthNo}
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                      Mã hóa đơn: #{currentInvoice.invoiceId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90">Học sinh</p>
                    <p className="font-bold text-lg">
                      {currentInvoice.studentName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Kỳ thanh toán</span>
                  <span className="font-medium text-gray-900">
                    {formatDateForInput(currentInvoice.dateFrom)} -{" "}
                    {formatDateForInput(currentInvoice.dateTo)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Số ngày nghỉ (có phép)</span>
                  <span className="font-medium text-gray-900">
                    {currentInvoice.absentDay} ngày
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Đơn giá/ngày (dự kiến)</span>
                  <span className="font-medium">60.000 ₫</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Hoàn tiền ngày nghỉ</span>
                  <span className="font-medium text-green-600">
                    - {formatCurrency(currentInvoice.absentDay * 60000)}
                  </span>
                </div>
                <div className="flex justify-between py-4 bg-gray-50 px-4 rounded-lg mt-4">
                  <span className="font-bold text-lg text-gray-800">
                    Tổng thanh toán
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    {currentInvoice.totalAmount
                      ? formatCurrency(currentInvoice.totalAmount)
                      : "Liên hệ nhà trường"}
                  </span>
                </div>
                <div className="text-center pt-4">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      currentInvoice.status === "Paid" ||
                      currentInvoice.status === "Đã thanh toán"
                        ? "bg-green-100 text-green-700"
                        : currentInvoice.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {currentInvoice.status === "Paid"
                      ? "✓ Đã thanh toán"
                      : currentInvoice.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
