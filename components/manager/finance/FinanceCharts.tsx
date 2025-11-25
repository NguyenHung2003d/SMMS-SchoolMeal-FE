import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { TrendingUp, ShoppingCart } from "lucide-react";
import { FinanceSummaryDto } from "@/types/manager-finance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const FinanceCharts = ({
  summary,
}: {
  summary: FinanceSummaryDto | null;
}) => {
  const incomeList = summary?.incomeByDate ?? [];

  const expenseList = summary?.supplierBreakdown ?? [];

  const incomeChartData: ChartData<"bar"> = {
    labels:
      incomeList.length > 0
        ? incomeList.map((d) => {
            try {
              return new Date(d.date).toLocaleDateString("vi-VN");
            } catch {
              return d.date;
            }
          })
        : ["Chưa có dữ liệu ngày"],
    datasets: [
      {
        label: "Thu nhập (VND)",
        data: incomeList.map((d) => d.amount ?? 0),
        backgroundColor: "#60a5fa",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const expensesChartData: ChartData<"pie"> = {
    labels: expenseList.map((e) => e.supplier || "Khác"),
    datasets: [
      {
        data: expenseList.map((e) => e.total ?? 0),
        backgroundColor: [
          "#fbbf24",
          "#34d399",
          "#60a5fa",
          "#f87171",
          "#a78bfa",
          "#9ca3af",
          "#fb7185",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp size={18} className="text-green-500 mr-2" />
          Biểu đồ thu nhập theo ngày
        </h2>
        <div className="h-64">
          {incomeList.length > 0 ? (
            <Bar data={incomeChartData} options={commonOptions} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-dashed border-2">
              <p>Chưa có dữ liệu thống kê theo ngày</p>
              <span className="text-xs mt-1">
                (Cần cập nhật Backend để có biểu đồ này)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <ShoppingCart size={18} className="text-red-500 mr-2" />
          Phân bổ chi phí (Nhà cung cấp)
        </h2>
        <div className="h-64 flex justify-center">
          {expenseList.length > 0 ? (
            <Pie data={expensesChartData} options={commonOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Chưa có dữ liệu chi phí
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
