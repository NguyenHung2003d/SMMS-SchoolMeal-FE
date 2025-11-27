"use client";
import React, { useMemo } from "react";
import { BarChart2, Activity } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { HealthRecord } from "@/types/warden-health";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface HealthChartsProps {
  data: HealthRecord[];
}

export const HealthCharts: React.FC<HealthChartsProps> = ({ data }) => {
  const classChartData = useMemo(() => {
    return {
      labels: data.map((s) => s.studentName),
      datasets: [
        {
          label: "BMI Hiện tại",
          data: data.map((s) => s.bmi || 0),
          backgroundColor: data.map((s) => {
            const bmi = s.bmi || 0;
            if (bmi === 0) return "#E5E7EB";
            if (bmi < 18.5) return "#60A5FA";
            if (bmi < 25) return "#34D399";
            if (bmi < 30) return "#FBBF24";
            return "#F87171";
          }),
          borderRadius: 4,
        },
      ],
    };
  }, [data]);

  const distributionData = useMemo(() => {
    let under = 0,
      norm = 0,
      over = 0,
      obese = 0;
    data.forEach((r) => {
      const bmi = r.bmi || 0;
      if (bmi > 0) {
        if (bmi < 18.5) under++;
        else if (bmi < 25) norm++;
        else if (bmi < 30) over++;
        else obese++;
      }
    });

    return {
      labels: ["Thiếu cân", "Bình thường", "Thừa cân", "Béo phì"],
      datasets: [
        {
          data: [under, norm, over, obese],
          backgroundColor: ["#60A5FA", "#34D399", "#FBBF24", "#F87171"],
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-500" /> Tổng quan BMI lớp học
        </h3>
        <div className="h-[300px]">
          <Bar
            data={classChartData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                x: { grid: { display: false } },
              },
            }}
          />
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
        <h3 className="mb-6 w-full text-left text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" /> Phân bố thể trạng
        </h3>
        <div className="h-[250px] w-full max-w-[250px]">
          <Doughnut
            data={distributionData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { usePointStyle: true, padding: 20 },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
