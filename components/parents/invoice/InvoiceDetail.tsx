import React from "react";
import {
  Building2,
  Calendar,
  User,
  Calculator,
  Info,
  Loader2,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { InvoiceDetails } from "@/types/invoices";
import { formatCurrency, formatDate } from "@/helpers";

interface Props {
  invoice: InvoiceDetails;
  onPayNow?: () => void;
  isProcessingPayment?: boolean;
}

export const InvoiceDetail: React.FC<Props> = ({
  invoice,
  onPayNow,
  isProcessingPayment,
}) => {
  const currentPackagePrice = invoice.amountTotal || 0;
  const mealPriceLastMonth = invoice.mealPricePerDayLastMonth || 0;
  const absentDays = invoice.absentDay || 0;
  const holidayDays = invoice.holiday || 0;
  const actualMealDays = invoice.totalMealLastMonth || 0;

  const refundAbsent = absentDays * mealPriceLastMonth;
  const refundHoliday = holidayDays * mealPriceLastMonth;
  const totalRefund = refundAbsent + refundHoliday;
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 opacity-80 text-xs font-bold uppercase tracking-widest mb-1">
              <Calculator size={14} /> Chi tiết thanh toán
            </div>
            <h3 className="font-extrabold text-2xl tracking-tight">
              Tháng {invoice.monthNo} ({formatDate(invoice.dateFrom)} -{" "}
              {formatDate(invoice.dateTo)})
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
            Chi tiết quyết toán & Khấu trừ{" "}
          </h4>

          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-gray-600 whitespace-nowrap text-sm">
                Tiền ăn cố định tháng {invoice.monthNo}{" "}
              </span>
              <div className="flex-1 border-b border-dotted border-gray-400 mb-1.5"></div>
              <span className="font-semibold text-gray-900">
                {formatCurrency(currentPackagePrice)}
              </span>
            </div>

            <div className="flex items-end gap-2 text-gray-500">
              <span className="text-xs whitespace-nowrap italic">
                Quyết toán tháng trước (Đơn giá:{" "}
                {formatCurrency(mealPriceLastMonth)}/bữa){" "}
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
                Khấu trừ nghỉ phép ({absentDays} bữa){" "}
              </span>
              <div className="flex-1 border-b border-dotted border-red-200 mb-1.5"></div>
              <span className="font-bold">-{formatCurrency(refundAbsent)}</span>{" "}
            </div>

            <div className="flex items-end gap-2 text-red-600">
              <span className="text-sm whitespace-nowrap font-medium">
                Khấu trừ nghỉ lễ/trường ({holidayDays} bữa){" "}
              </span>
              <div className="flex-1 border-b border-dotted border-red-200 mb-1.5"></div>
              <span className="font-bold">
                -{formatCurrency(refundHoliday)}
              </span>{" "}
            </div>

            <div className="pt-4 mt-2 border-t border-amber-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-900">
                  SỐ TIỀN CẦN ĐÓNG:{" "}
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-800 leading-none">
                    {formatCurrency(invoice.amountToPay)}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    (Đã bao gồm khấu trừ {formatCurrency(totalRefund)})
                  </p>
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
          {invoice.status !== "Paid" && onPayNow && (
            <button
              onClick={onPayNow}
              disabled={isProcessingPayment}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-8 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessingPayment ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <CreditCard size={18} />
                  THANH TOÁN NGAY
                  <ExternalLink size={14} className="opacity-50" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
