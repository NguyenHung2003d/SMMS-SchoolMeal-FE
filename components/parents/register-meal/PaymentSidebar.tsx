import { Invoice } from "@/types/invoices";
import { formatCurrency } from "@/helpers";
import { CreditCard, Info } from "lucide-react";

interface PaymentSidebarProps {
  selectedInvoice: Invoice | null;
  onPay: () => void;
}

export const PaymentSidebar = ({
  selectedInvoice,
  onPay,
}: PaymentSidebarProps) => {
  if (!selectedInvoice) return null;
  const unitPriceLastMonth = selectedInvoice.mealPricePerDayLastMonth || 0;
  const totalOffDays =
    (selectedInvoice.holiday || 0) + (selectedInvoice.absentDay || 0);
  const totalDeduction = totalOffDays * unitPriceLastMonth;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
        <Info size={18} className="text-blue-600" />
        Chi tiết tính tiền ăn
      </h3>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">
              Tiền ăn tháng {selectedInvoice.monthNo}:
            </span>
            <span className="font-bold text-gray-900">
              {formatCurrency(selectedInvoice.amountTotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 italic">
            <span>
              (Đơn giá cơm: {formatCurrency(selectedInvoice.mealPricePerDay)}
              /ngày)
            </span>
          </div>
        </div>

        <div className="bg-blue-50/50 rounded-lg p-3 space-y-3 border border-blue-100">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Khấu trừ tháng trước (
            {selectedInvoice.monthNo === 1 ? 12 : selectedInvoice.monthNo - 1}):
          </p>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Nghỉ lễ / Trường nghỉ:</span>
            <span className="font-medium">
              {selectedInvoice.holiday || 0} ngày
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Số ngày nghỉ phép:</span>
            <span className="font-medium">
              {selectedInvoice.absentDay || 0} ngày
            </span>
          </div>

          <div className="flex justify-between text-sm font-semibold text-red-500 pt-1 border-t border-blue-100">
            <span>Tổng tiền được trừ:</span>
            <span>-{formatCurrency(totalDeduction)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-800 font-bold">Thực thu:</span>
            <span className="text-2xl font-black text-blue-600">
              {formatCurrency(selectedInvoice.amountToPay)}
            </span>
          </div>
        </div>

        <button
          onClick={onPay}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <CreditCard
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Thanh toán ngay
        </button>

        <p className="text-[11px] text-center text-gray-400">
          Hệ thống thanh toán tự động qua <b>PayOS</b>
        </p>
      </div>
    </div>
  );
};
