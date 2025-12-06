"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useSelectedChild } from "@/context/SelectedChildContext";
import { axiosInstance } from "@/lib/axiosInstance";
import { InvoiceDto } from "@/types/invoices";
import { formatCurrency, formatDate } from "@/helpers";

export default function InvoicePage() {
  const { selectedChild } = useSelectedChild();

  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!selectedChild?.studentId) {
      setInvoices([]);
      setSelectedInvoiceId(null); // Reset selection ngay khi không có bé
      return;
    }

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setInvoices([]);

        const res = await axiosInstance.get<InvoiceDto[]>(
          "/Invoice/my-invoices",
          {
            params: {
              studentId: selectedChild.studentId,
            },
          }
        );
        setInvoices(res.data);
      } catch (error: any) {
        console.error("Lỗi tải hóa đơn:", error);
        if (error.response?.status === 404) {
          setInvoices([]);
        } else {
          const msg =
            error.response?.data?.message || "Không thể tải danh sách hóa đơn.";
          toast.error(msg);
          setInvoices([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [selectedChild?.studentId]);

  const childInvoices = invoices;

  useEffect(() => {
    if (childInvoices.length > 0) {
      const currentIdExists = childInvoices.some(
        (inv) => inv.invoiceId === selectedInvoiceId
      );

      if (selectedInvoiceId === null || !currentIdExists) {
        const sorted = [...childInvoices].sort(
          (a, b) => b.invoiceId - a.invoiceId
        );
        setSelectedInvoiceId(sorted[0].invoiceId);
      }
    } else {
      setSelectedInvoiceId(null);
    }
  }, [childInvoices, selectedInvoiceId]);

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
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800">Xem hóa đơn</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : childInvoices.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          Chưa có hóa đơn nào cho bé <strong>{selectedChild.name}</strong>.
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
            <div className="bg-white rounded-lg shadow overflow-hidden animate-in fade-in zoom-in-95 duration-300">
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
                    {formatDate(currentInvoice.dateFrom)} -{" "}
                    {formatDate(currentInvoice.dateTo)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Số ngày nghỉ (có phép)</span>
                  <span className="font-medium text-gray-900">
                    {currentInvoice.absentDay} ngày
                  </span>
                </div>

                {/* Phần tính toán tiền */}
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Hoàn tiền ngày nghỉ</span>
                  <span className="font-medium text-green-600">
                    - {formatCurrency(currentInvoice.absentDay * 60000)}
                  </span>
                </div>

                <div className="flex justify-between py-4 bg-gray-50 px-4 rounded-lg mt-4 items-center">
                  <span className="font-bold text-lg text-gray-800">
                    Tổng thanh toán
                  </span>
                  <span className="font-bold text-xl text-blue-600">
                    {formatCurrency(currentInvoice.amountToPay)}
                  </span>
                </div>

                <div className="text-center pt-4">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      currentInvoice.status === "Paid" ||
                      currentInvoice.status === "Đã thanh toán"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : currentInvoice.status === "Pending" ||
                          currentInvoice.status === "Unpaid"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {currentInvoice.status === "Paid" ||
                    currentInvoice.status === "Đã thanh toán"
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
