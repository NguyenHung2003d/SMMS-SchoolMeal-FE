import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { ShoppingCart } from "lucide-react";
import { FinanceSummaryDto } from "@/types/manager-finance";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
};

const CHART_COLORS = [
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f87171",
  "#a78bfa",
  "#9ca3af",
  "#fb7185",
];

export const FinanceCharts = React.memo(
  ({ summary }: { summary: FinanceSummaryDto | null }) => {
    const expenseList = summary?.supplierBreakdown ?? [];

    const expensesChartData: ChartData<"pie"> = useMemo(
      () => ({
        labels: expenseList.map((e) => e.supplier || "Khác"),
        datasets: [
          {
            data: expenseList.map((e) => e.total ?? 0),
            backgroundColor: CHART_COLORS,
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      }),
      [expenseList]
    );

    return (
      <div className="mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border max-w-lg mx-auto">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <ShoppingCart size={18} className="text-red-500 mr-2" />
            Phân bổ chi phí (Nhà cung cấp)
          </h2>
          <div className="h-64 flex justify-center relative">
            {expenseList.length > 0 ? (
              <Pie data={expensesChartData} options={COMMON_OPTIONS} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                Chưa có dữ liệu chi phí
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
