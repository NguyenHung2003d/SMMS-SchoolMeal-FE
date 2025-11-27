"use client";

import { formatCurrency } from "@/helpers";
import { AdminDashboardOverview } from "@/types/admin-dashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartOptions,
} from "chart.js";
import { DollarSign, Users } from "lucide-react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardCharts({
  data,
}: {
  data: AdminDashboardOverview;
}) {
  if (!data) return null;

  const prevSchools = Math.round(
    data.totalSchools / (1 + data.schoolGrowth / 100)
  );
  const prevStudents = Math.round(
    data.totalStudents / (1 + data.studentGrowth / 100)
  );

  const revenueChartData = {
    labels: ["Tháng trước", "Tháng này"],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [data.previousMonthRevenue, data.currentMonthRevenue],
        backgroundColor: [
          "rgba(156, 163, 175, 0.5)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: ["rgba(156, 163, 175, 1)", "rgba(249, 115, 22, 1)"],
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const revenueOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.raw as number),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            const numVal = Number(value);
            if (numVal >= 1000000000)
              return (numVal / 1000000000).toFixed(1) + "B";
            if (numVal >= 1000000) return (numVal / 1000000).toFixed(0) + "M";
            return numVal;
          },
        },
      },
      x: { grid: { display: false } },
    },
  };

  const scaleChartData = {
    labels: ["Tháng trước", "Tháng này"],
    datasets: [
      {
        label: "Học sinh",
        data: [prevStudents, data.totalStudents],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        yAxisID: "y",
        borderRadius: 6,
        barPercentage: 0.4,
      },
      {
        label: "Trường học",
        data: [prevSchools, data.totalSchools],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        yAxisID: "y1",
        borderRadius: 6,
        barPercentage: 0.4,
      },
    ],
  };

  const scaleOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Số lượng học sinh" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: { display: true, text: "Số lượng trường" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-orange-500" />
          So sánh Doanh thu
        </h3>
        <div className="h-60">
          <Bar data={revenueChartData} options={revenueOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          Tăng trưởng Quy mô
        </h3>
        <div className="h-60">
          <Bar data={scaleChartData} options={scaleOptions} />
        </div>
      </div>
    </div>
  );
}
