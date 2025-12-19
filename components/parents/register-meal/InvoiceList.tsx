import React from "react";
import { Invoice } from "@/types/invoices";
import { formatCurrency } from "@/helpers";
import { Calendar, CheckCircle2, Receipt } from "lucide-react";

interface InvoiceListProps {
  invoices: Invoice[];
  selectedInvoiceId: number | string | null;
  onSelect: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  selectedInvoiceId,
  onSelect,
}) => {
  return (
    <>
      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
        <Receipt size={18} /> Danh sách hóa đơn
      </h3>

      <div className="space-y-3">
        {invoices.map((inv) => {
          const isSelected = selectedInvoiceId === inv.invoiceId;
          return (
            <div
              key={inv.invoiceId}
              onClick={() => onSelect(inv)}
              className={`
                relative group flex flex-col sm:flex-row sm:items-center justify-between 
                p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 shadow-md scale-[1.01]"
                    : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"
                }
              `}
            >
              <div
                className={`absolute top-4 right-4 sm:static sm:mr-4 transition-colors ${
                  isSelected
                    ? "text-blue-600"
                    : "text-gray-300 group-hover:text-blue-300"
                }`}
              >
                {isSelected ? (
                  <CheckCircle2
                    size={24}
                    fill="currentColor"
                    className="text-white"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-current"></div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                    Tháng {inv.monthNo}
                  </span>
                  <span className="text-gray-400 text-xs">
                    Mã hoá đơn: #{inv.invoiceId}
                  </span>
                </div>

                <p className="font-bold text-gray-800 text-lg">
                  Học phí bán trú
                </p>
                <p className="text-xs text-gray-500 italic">
                    Đơn giá: {formatCurrency(inv.mealPricePerDay)}/ngày
                  </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(inv.dateFrom).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(inv.dateTo).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                  {inv.absentDay > 0 && (
                    <span className="text-orange-600 text-xs bg-orange-50 px-2 py-0.5 rounded border border-orange-100 whitespace-nowrap">
                      - {inv.absentDay} buổi con nghỉ
                    </span>
                  )}
                  {inv.holiday > 0 && (
                    <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1 whitespace-nowrap">
                      - {inv.holiday} ngày lễ
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-xs text-gray-500 mb-1">Tổng thanh toán</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(inv.amountToPay)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
