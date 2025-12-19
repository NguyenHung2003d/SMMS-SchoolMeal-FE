import React from "react";
import { Building2, Calendar, User } from "lucide-react";
import { InvoiceDetails } from "@/types/invoices";
import { formatCurrency, formatDate } from "@/helpers";

interface Props {
  invoice: InvoiceDetails;
}

export const InvoiceDetail: React.FC<Props> = ({ invoice }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              Tháng {invoice.monthNo}
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Mã hóa đơn: #{invoice.invoiceId}
            </p>
          </div>
          <div className="text-right bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-xs font-medium text-blue-100 uppercase">
              Học sinh
            </p>
            <p className="font-bold text-lg">{invoice.studentName}</p>
            <p className="text-xs text-blue-100">Lớp: {invoice.className}</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
              <Calendar size={18} /> Kỳ thanh toán
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Từ ngày:</span>
                <span className="font-medium">
                  {formatDate(invoice.dateFrom)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Đến ngày:</span>
                <span className="font-medium">
                  {formatDate(invoice.dateTo)}
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
                {invoice.absentDay} ngày
              </span>
            </div>
            <p className="text-xs text-orange-600/70 mt-2 italic">
              * Đã được trừ vào tổng tiền
            </p>
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Building2 size={18} /> Thông tin chuyển khoản (Trường)
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Trường học</p>
              <p className="font-medium text-gray-900">{invoice.schoolName}</p>
            </div>
            <div>
              <p className="text-gray-500">Ngân hàng</p>
              <p className="font-medium text-gray-900">
                {invoice.settlementBankCode}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500">Số tài khoản thụ hưởng</p>
              <p className="font-mono font-bold text-gray-900 text-lg tracking-wide">
                {invoice.settlementAccountNo}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-xl gap-4">
          <div className="text-center md:text-left">
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${
                invoice.status === "Paid" || invoice.status === "Đã thanh toán"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {invoice.status === "Paid" || invoice.status === "Đã thanh toán"
                ? "✓ ĐÃ THANH TOÁN"
                : "⏳ CHƯA THANH TOÁN"}
            </span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm mb-1">Tổng tiền phải đóng</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(invoice.amountToPay)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
