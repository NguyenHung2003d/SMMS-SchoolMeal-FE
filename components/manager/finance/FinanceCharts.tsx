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

// Đăng ký các thành phần ChartJS cần thiết
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

export const FinanceCharts = React.memo(
  ({ summary }: { summary: FinanceSummaryDto | null }) => {
    // --- 1. Dữ liệu cho Biểu đồ Tròn (Nhà cung cấp) ---
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

    // --- 2. Dữ liệu cho Biểu đồ Cột (Thu/Chi theo tháng) --- [NEW]
    const monthlyList = summary?.monthlyBreakdown ?? [];
    const barChartData: ChartData<"bar"> = useMemo(
      () => ({
        labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
        datasets: [
          {
            label: "Doanh Thu (Thu)",
            data: monthlyList.map((m) => m.income ?? 0),
            backgroundColor: "#34d399", // Màu xanh lá
            borderRadius: 4,
          },
          {
            label: "Chi Phí (Đi chợ)",
            data: monthlyList.map((m) => m.expense ?? 0),
            backgroundColor: "#f87171", // Màu đỏ
            borderRadius: 4,
          },
        ],
      }),
      [monthlyList]
    );

    const barOptions = {
      ...COMMON_OPTIONS,
      plugins: {
        legend: { position: "top" as const },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return (value / 1000000).toLocaleString() + "M"; // Rút gọn số tiền
            },
          },
        },
      },
    };

    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ 1: Phân bổ nhà cung cấp (Pie) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
              <ShoppingCart size={20} className="text-blue-500 mr-2" />
              Tỷ trọng nhà cung cấp
            </h2>
            <div className="h-64 flex justify-center relative">
              {expenseList.length > 0 ? (
                <Pie data={pieChartData} options={COMMON_OPTIONS} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Chưa có dữ liệu chi phí
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-700">
              <BarChart3 size={20} className="text-green-500 mr-2" />
              Biến động Thu - Chi theo năm
            </h2>
            <div className="h-64 relative">
              {monthlyList.some((m) => m.income > 0 || m.expense > 0) ? (
                <Bar data={barChartData} options={barOptions} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Chưa có dữ liệu năm nay
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
