import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { ShoppingCart, BarChart3 } from "lucide-react";
import { FinanceSummaryDto } from "@/types/manager-finance";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
};

const PIE_COLORS = [
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f87171",
  "#a78bfa",
  "#9ca3af",
  "#fb7185",
];

const formatCurrency = (value: number) => {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + " Tỷ";
  if (value >= 1000000) return (value / 1000000).toFixed(0) + " Tr";
  return value.toLocaleString();
};

export const FinanceCharts = React.memo(
  ({ summary }: { summary: FinanceSummaryDto | null }) => {
    const expenseList = summary?.supplierBreakdown ?? [];
    const pieChartData: ChartData<"pie"> = useMemo(
      () => ({
        labels: expenseList.map((e) => e.supplier || "Khác"),
        datasets: [
          {
            data: expenseList.map((e) => e.total ?? 0),
            backgroundColor: PIE_COLORS,
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      }),
      [expenseList]
    );

    const barChartData: ChartData<"bar"> = useMemo(
      () => ({
        labels: [`Năm ${summary?.year || "..."}`],
        datasets: [
          {
            label: "Tổng Thu (Hóa đơn)",
            data: [summary?.totalInvoices ?? 0],
            backgroundColor: "#10b981",
            borderRadius: 6,
            barPercentage: 0.5,
            minBarLength: 5,
          },
          {
            label: "Tổng Chi (Đi chợ)",
            data: [summary?.totalPurchaseCost ?? 0],
            backgroundColor: "#ef4444",
            borderRadius: 6,
            barPercentage: 0.5,
            minBarLength: 5,
          },
        ],
      }),
      [summary]
    );

    const barOptions = {
      ...COMMON_OPTIONS,
      plugins: {
        legend: { position: "top" as const },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return formatCurrency(value);
            },
          },
        },
      },
    };

    if (!summary) return null;

    return (
      <div className="mb-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
              <BarChart3 size={20} className="text-green-500 mr-2" />
              Cán cân Thu - Chi Năm {summary.year}
            </h2>
            <div className="h-72 relative">
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
              <ShoppingCart size={20} className="text-blue-500 mr-2" />
              Tỷ trọng chi phí nhà cung cấp
            </h2>
            <div className="h-72 flex justify-center relative">
              {expenseList.length > 0 ? (
                <Pie data={pieChartData} options={COMMON_OPTIONS} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm flex-col">
                  <span>Chưa có dữ liệu chi phí</span>
                  <span className="text-xs text-gray-300 mt-1">
                    (Chưa có đơn đi chợ nào)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
