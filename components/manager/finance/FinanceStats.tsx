import React, { useMemo } from "react";
import {
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/helpers";
import { FinanceSummaryDto } from "@/types/manager-finance";

interface FinanceStatsProps {
  summary: FinanceSummaryDto | null;
  onOpenShopping: () => void;
  selectedMonth: number;
}

export const FinanceStats = React.memo(
  ({ summary, onOpenShopping, selectedMonth }: FinanceStatsProps) => {
    const stats = useMemo(() => {
      const totalIncome = summary?.totalInvoices ?? 0;
      const paidInvoices = summary?.paidInvoices ?? 0;
      const unpaidInvoices = summary?.unpaidInvoices ?? 0;
      const totalExpense = summary?.totalPurchaseCost ?? 0;
      const netIncome = totalIncome - totalExpense;

      return {
        totalIncome,
        paidInvoices,
        unpaidInvoices,
        totalExpense,
        netIncome,
        percentPaid:
          totalIncome > 0 ? ((paidInvoices / totalIncome) * 100).toFixed(1) : 0,
      };
    }, [summary]);

    const cards = [
      {
        label: "Tổng Thu Nhập",
        value: stats.totalIncome,
        subText: `Tháng ${selectedMonth}`,
        colorClass: "text-green-600",
        icon: TrendingUp,
        iconColor: "text-green-200",
      },
      {
        label: "Đã Thanh Toán",
        value: stats.paidInvoices,
        subText: `${stats.percentPaid}% hoàn thành`,
        colorClass: "text-blue-600",
        icon: CheckCircle,
        iconColor: "text-blue-200",
      },
      {
        label: "Chưa Thanh Toán",
        value: stats.unpaidInvoices,
        subText:
          stats.unpaidInvoices > 0 ? "Cần xử lý: Có" : "Cần xử lý: Không",
        colorClass: "text-orange-600",
        icon: AlertCircle,
        iconColor: "text-orange-200",
      },
      {
        label: "Chi Phí Đi Chợ",
        value: stats.totalExpense,
        subText: "Click xem chi tiết",
        colorClass: "text-red-600",
        icon: ShoppingCart,
        iconColor: "text-red-200 group-hover:text-red-500",
        onClick: onOpenShopping,
        cursor: "cursor-pointer group",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition ${
              card.cursor || ""
            }`}
            onClick={card.onClick}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-2">{card.label}</p>
                <h3 className={`text-2xl font-bold ${card.colorClass}`}>
                  {formatCurrency(card.value)}
                </h3>
              </div>
              <card.icon
                className={`transition-colors ${card.iconColor}`}
                size={24}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{card.subText}</p>
          </div>
        ))}

        <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Lợi Nhuận Ròng (Dự kiến)
              </p>
              <h2
                className={`text-3xl font-bold ${
                  stats.netIncome >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(stats.netIncome)}
              </h2>
              <p className="text-xs text-gray-500 mt-2">
                Tổng thu: {formatCurrency(stats.totalIncome)} - Tổng chi:{" "}
                {formatCurrency(stats.totalExpense)}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                stats.netIncome >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {stats.netIncome >= 0 ? "✅ Dương" : "❌ Âm"}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
