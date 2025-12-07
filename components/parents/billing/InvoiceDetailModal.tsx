"use client";
import React from "react";
import {
  Building2,
  Calendar,
  CheckCircle,
  Receipt,
  User,
  X,
} from "lucide-react";
import { formatCurrency } from "@/helpers";

// Định nghĩa lại kiểu dữ liệu khớp với API chi tiết
interface InvoiceDetailData {
  invoiceId: number;
  studentName: string;
  className: string;
  schoolName: string;
  status: string;
  monthNo: number;
  dateFrom: string;
  dateTo: string;
  absentDay: number;
  amountToPay: number;
  settlementAccountNo: string;
  settlementBankCode: string;
}

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: InvoiceDetailData | null; // Cho phép null
  isProcessing: boolean;
}

export const InvoiceDetailModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  isProcessing,
}: InvoiceDetailModalProps) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center shrink-0">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
            <div className="bg-blue-500/30 p-2 rounded-lg backdrop-blur-sm">
              <Receipt size={24} />
            </div>
            Hóa đơn #{data.invoiceId}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-blue-500/20 p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200/50">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <User size={16} className="text-white" />
                </div>
                Thông tin học sinh
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Họ tên</span>
                  <span className="font-semibold text-gray-900">
                    {data.studentName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lớp</span>
                  <span className="font-semibold text-gray-900">
                    {data.className}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-gray-600">Trạng thái</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      data.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {data.status === "Paid"
                      ? "✓ Đã thanh toán"
                      : "⏳ Chưa thanh toán"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 rounded-xl border border-gray-200/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <div className="bg-gray-600 p-2 rounded-lg">
                  <Building2 size={16} className="text-white" />
                </div>
                Thông tin trường học
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trường</span>
                  <span
                    className="font-semibold text-gray-900 text-right truncate max-w-[150px]"
                    title={data.schoolName}
                  >
                    {data.schoolName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">TK Thụ hưởng</span>
                  <span className="font-semibold text-gray-900 font-mono text-xs">
                    {data.settlementAccountNo}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Ngân hàng</span>
                  <span className="font-semibold text-gray-900">
                    {data.settlementBankCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-xl border border-amber-200/50">
            <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-4">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Calendar size={16} className="text-white" />
              </div>
              Chi tiết kỳ thu tháng {data.monthNo}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian</span>
                <span className="font-semibold text-gray-900">
                  {new Date(data.dateFrom).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(data.dateTo).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số ngày nghỉ (đã trừ)</span>
                <span className="font-semibold text-gray-900">
                  {data.absentDay} ngày
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center text-white">
              <span className="text-lg font-medium text-blue-100">
                Tổng tiền phải đóng
              </span>
              <span className="text-3xl font-bold tracking-tight">
                {formatCurrency(data.amountToPay)}
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-xs flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>
              Vui lòng kiểm tra kỹ thông tin học sinh và số tiền trước khi tiến
              hành thanh toán qua cổng PayOS.
            </span>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose} 
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-lg font-medium transition-all hover:shadow-sm"
          >
            Đóng
          </button>
          <button
            onClick={onConfirm} 
            disabled={isProcessing}
            className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold shadow-lg transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle size={18} className="mr-2" /> Xác nhận thanh toán
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
