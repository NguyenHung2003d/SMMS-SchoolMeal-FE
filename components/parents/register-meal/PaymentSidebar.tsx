import React from "react";
import { Invoice } from "@/types/invoices";
import { formatCurrency } from "@/helpers";
import { CreditCard } from "lucide-react";

interface PaymentSidebarProps {
  selectedInvoice: Invoice | null;
  onPay: () => void;
}

export const PaymentSidebar: React.FC<PaymentSidebarProps> = ({
  selectedInvoice,
  onPay,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
        Thông tin thanh toán
      </h3>

      {selectedInvoice ? (
        <div className="space-y-4">
          <InfoRow label="Mã hóa đơn" value={`#${selectedInvoice.invoiceId}`} />
          <InfoRow label="Tháng" value={selectedInvoice.monthNo} />
          <InfoRow label="Số ngày nghỉ" value={selectedInvoice.absentDay} />
          <InfoRow
            label="Số ngày nghỉ lễ/trường"
            value={selectedInvoice.holiday}
          />

          <div className="border-t border-dashed my-2 pt-2">
            <div className="flex justify-between items-end">
              <span className="text-gray-800 font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedInvoice.amountToPay)}
              </span>
            </div>
          </div>

          <button
            onClick={onPay}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <CreditCard
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Thanh toán ngay
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">
            Thanh toán an toàn qua cổng PayOS
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p>Vui lòng chọn một hóa đơn để tiếp tục</p>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between text-sm text-gray-600">
    <span>{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);
