import React, { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { HealthPoint } from "@/types/parent";

interface HealthChartProps {
  historyData: HealthPoint[];
  selectedChart: "bmi" | "height" | "weight";
  setSelectedChart: (type: "bmi" | "height" | "weight") => void;
}

export default function HealthChart({
  historyData,
  selectedChart,
  setSelectedChart,
}: HealthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Hàm nội suy đường cong cho mượt
  function interpolateMonthly(data: HealthPoint[], segmentsPerMonth = 3) {
    const labels: string[] = [];
    const heightSeries: number[] = [];
    const weightSeries: number[] = [];
    const bmiSeries: number[] = [];

    if (!data || data.length === 0)
      return { labels, heightSeries, weightSeries, bmiSeries };

    if (data.length === 1) {
      const point = data[0];
      return {
        labels: [point.month],
        heightSeries: [point.height],
        weightSeries: [point.weight],
        bmiSeries: [point.bmi],
      };
    }

    const steps = segmentsPerMonth - 1;
    for (let i = 0; i < data.length - 1; i++) {
      const a = data[i];
      const b = data[i + 1];
      for (let s = 0; s <= steps; s++) {
        if (i > 0 && s === 0) continue;
        const t = s / steps;
        const label = s === 0 ? a.month : "";
        labels.push(label);
        heightSeries.push(
          Number((a.height + (b.height - a.height) * t).toFixed(1))
        );
        weightSeries.push(
          Number((a.weight + (b.weight - a.weight) * t).toFixed(1))
        );
        bmiSeries.push(Number((a.bmi + (b.bmi - a.bmi) * t).toFixed(1)));
      }
    }
    const last = data[data.length - 1];
    labels.push(last.month);
    heightSeries.push(last.height);
    weightSeries.push(last.weight);
    bmiSeries.push(last.bmi);

    return { labels, heightSeries, weightSeries, bmiSeries };
  }

  // Cấu hình hiển thị Chart
  const getDataset = (interp: ReturnType<typeof interpolateMonthly>) => {
    const commonOptions = {
      tension: 0.35,
      pointRadius: (ctx: any) =>
        interp.labels.length === 1 || (ctx.raw && ctx.dataIndex % 3 === 0)
          ? 4
          : 0,
    };

    switch (selectedChart) {
      case "bmi":
        return [
          {
            label: "BMI",
            data: interp.bmiSeries,
            borderColor: "rgb(147, 51, 234)",
            backgroundColor: "rgba(147, 51, 234, 0.1)",
            ...commonOptions,
          },
        ];
      case "height":
        return [
          {
            label: "Chiều cao (cm)",
            data: interp.heightSeries,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            ...commonOptions,
          },
        ];
      case "weight":
        return [
          {
            label: "Cân nặng (kg)",
            data: interp.weightSeries,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            ...commonOptions,
          },
        ];
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      LineController,
      Title,
      Tooltip,
      Legend
    );

    const interp = interpolateMonthly(historyData, 3);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: interp.labels,
        datasets: getDataset(interp),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: { y: { beginAtZero: false } },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [selectedChart, historyData]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[
          { key: "bmi", label: "BMI", color: "bg-purple-600" },
          { key: "height", label: "Chiều cao", color: "bg-blue-600" },
          { key: "weight", label: "Cân nặng", color: "bg-green-600" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSelectedChart(btn.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedChart === btn.key
                ? `${btn.color} text-white shadow-md`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="h-80">
          {historyData.length > 0 ? (
            <canvas ref={chartRef} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Chưa có dữ liệu lịch sử để vẽ biểu đồ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
