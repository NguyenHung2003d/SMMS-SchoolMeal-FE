import React from "react";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/helpers";
import { FinanceSummaryDto } from "@/types/manager-finance";

interface FinanceStatsProps {
  summary: FinanceSummaryDto | null;
  onOpenShopping: () => void;
  selectedMonth: number;
}

export const FinanceStats = ({
  summary,
  onOpenShopping,
  selectedMonth,
}: FinanceStatsProps) => {
  const totalIncome = summary?.totalInvoices ?? 0; // Backend: TotalInvoices
  const paidInvoices = summary?.paidInvoices ?? 0; // Backend: PaidInvoices
  const unpaidInvoices = summary?.unpaidInvoices ?? 0; // Backend: UnpaidInvoices
  const totalExpense = summary?.totalPurchaseCost ?? 0; // Backend: TotalPurchaseCost

  const netIncome = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500 mb-2">Tổng Thu Nhập</p>
        <h3 className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </h3>
        <p className="text-xs text-gray-400 mt-2">Tháng {selectedMonth}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500 mb-2">Đã Thanh Toán</p>
        <h3 className="text-2xl font-bold text-blue-600">
          {formatCurrency(paidInvoices)}
        </h3>
        <p className="text-xs text-gray-400 mt-2">
          {totalIncome > 0
            ? ((paidInvoices / totalIncome) * 100).toFixed(1)
            : 0}
          % hoàn thành
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
        <p className="text-sm text-gray-500 mb-2">Chưa Thanh Toán</p>
        <h3 className="text-2xl font-bold text-orange-600">
          {formatCurrency(unpaidInvoices)}
        </h3>
        <p className="text-xs text-gray-400 mt-2">
          Cần xử lý: {unpaidInvoices > 0 ? "Có" : "Không"}
        </p>
      </div>

      <div
        className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer group"
        onClick={onOpenShopping}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Chi Phí Đi Chợ</p>
            <h3 className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpense)}
            </h3>
          </div>
          <ShoppingCart
            className="text-red-200 group-hover:text-red-500 transition-colors"
            size={24}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">Click xem chi tiết</p>
      </div>

      <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Lợi Nhuận Ròng (Dự kiến)
            </p>
            <h2
              className={`text-3xl font-bold ${
                netIncome >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(netIncome)}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Tổng thu: {formatCurrency(totalIncome)} - Tổng chi:{" "}
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            {netIncome >= 0 ? "✅ Dương" : "❌ Âm"}
          </div>
        </div>
      </div>
    </div>
  );
};
