import React from "react";
import { Building2, Calendar, User, Calculator, Info } from "lucide-react";
import { InvoiceDetails } from "@/types/invoices";
import { formatCurrency, formatDate } from "@/helpers";

interface Props {
  invoice: InvoiceDetails;
}

export const InvoiceDetail: React.FC<Props> = ({ invoice }) => {
  const mealPrice = invoice.mealPricePerDay || 0;
  const packagePrice = invoice.amountTotal || 0;
  const absentDays = invoice.absentDay || 0;
  const holidayDays = invoice.holiday || 0;
  const actualMealDays = invoice.totalMealLastMonth || 0;
  const totalRefund = (absentDays + holidayDays) * mealPrice;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 opacity-80 text-xs font-bold uppercase tracking-widest mb-1">
              <Calculator size={14} /> Chi tiết thanh toán
            </div>
            <h3 className="font-extrabold text-2xl tracking-tight">
              Tháng {invoice.monthNo}
            </h3>
            <p className="text-blue-100 text-xs font-mono mt-1 opacity-70">
              ID: #{invoice.invoiceId}
            </p>
          </div>
          <div className="text-right bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tighter">
              Học sinh
            </p>
            <p className="font-bold text-lg">{invoice.studentName}</p>
            <p className="text-xs text-blue-100 opacity-80">
              Lớp: {invoice.className}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-inner">
          <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-6 text-base">
            <Calculator size={18} className="text-amber-600" />
            Quyết toán tiền ăn tháng trước
          </h4>

          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-gray-600 whitespace-nowrap text-sm">
                Tiền ăn cố định (trọn gói)
              </span>
              <div className="flex-1 border-b border-dotted border-gray-400 mb-1.5"></div>
              <span className="font-semibold text-gray-900">
                {formatCurrency(packagePrice)}
              </span>
            </div>

            <div className="flex items-end gap-2 text-gray-500">
              <span className="text-xs whitespace-nowrap italic">
                Đơn giá: {formatCurrency(mealPrice)}/ngày
              </span>
              <div className="flex-1 border-b border-dotted border-gray-300 mb-1"></div>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-gray-600 whitespace-nowrap text-sm">
                Số bữa đã ăn thực tế
              </span>
              <div className="flex-1 border-b border-dotted border-gray-400 mb-1.5"></div>
              <span className="font-bold text-blue-700">
                {actualMealDays} bữa
              </span>
            </div>

            <div className="flex items-end gap-2 text-red-600">
              <span className="text-sm whitespace-nowrap font-medium">
                Khấu trừ nghỉ phép
              </span>
              <div className="flex-1 border-b border-dotted border-red-200 mb-1.5"></div>
              <span className="font-bold">-{absentDays} bữa</span>
            </div>

            <div className="flex items-end gap-2 text-red-600">
              <span className="text-sm whitespace-nowrap font-medium">
                Khấu trừ nghỉ lễ/trường
              </span>
              <div className="flex-1 border-b border-dotted border-red-200 mb-1.5"></div>
              <span className="font-bold">-{holidayDays} bữa</span>
            </div>

            <div className="pt-4 mt-2 border-t border-amber-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-900">
                  THÀNH TIỀN CẦN ĐÓNG:
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-800 leading-none">
                    {formatCurrency(invoice.amountToPay)}
                  </p>
                  {totalRefund > 0 && (
                    <p className="text-[10px] text-green-600 font-bold mt-2 uppercase tracking-tighter">
                      (Đã trừ {formatCurrency(totalRefund)} tiền cơm nghỉ)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm">
            <Building2 size={18} className="text-gray-400" /> Đơn vị thụ hưởng
            (Trường)
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Tên trường
                </p>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.schoolName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Ngân hàng
                </p>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.settlementBankCode}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                Số tài khoản
              </p>
              <p className="font-mono font-bold text-gray-900 text-xl tracking-wider select-all">
                {invoice.settlementAccountNo}
              </p>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                * Vui lòng kiểm tra kỹ số tài khoản khi chuyển khoản
              </p>
            </div>
          </div>
        </div>

        {/* Trạng thái cuối */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          <span
            className={`inline-flex items-center px-6 py-2 rounded-full text-xs font-black tracking-widest border shadow-sm ${
              invoice.status === "Paid"
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-orange-50 text-orange-600 border-orange-200"
            }`}
          >
            {invoice.status === "Paid"
              ? "✓ ĐÃ THANH TOÁN"
              : "⏳ CHỜ THANH TOÁN"}
          </span>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Info size={14} />
            Hóa đơn từ {formatDate(invoice.dateFrom)} -{" "}
            {formatDate(invoice.dateTo)}
          </div>
        </div>
      </div>
    </div>
  );
};
