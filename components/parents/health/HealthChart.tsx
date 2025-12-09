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
  Filler,
  ChartConfiguration,
  ChartData,
} from "chart.js";
import { HealthPoint } from "@/types/parent";
import { Activity, Ruler, Weight } from "lucide-react";

// Register the Filler plugin
Chart.register(Filler);

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

    const createGradient = (colorStart: string, colorEnd: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      return gradient;
    };

    const interp = interpolateMonthly(historyData, 3);

    // Explicitly define commonOptions with 'any' to avoid strict type conflict with 'fill'
    const commonOptions: any = {
      tension: 0.4,
      pointRadius: (ctx: any) =>
        interp.labels.length === 1 || (ctx.raw && ctx.dataIndex % 3 === 0)
          ? 5
          : 0,
      pointHoverRadius: 7,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 2,
      fill: true, // This property causes the issue without 'any' or correct type
    };

    let dataset: any = {};

    if (selectedChart === "bmi") {
      dataset = {
        label: "Chỉ số BMI",
        data: interp.bmiSeries,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: createGradient(
          "rgba(168, 85, 247, 0.4)",
          "rgba(168, 85, 247, 0.0)"
        ),
        pointBorderColor: "rgb(168, 85, 247)",
      };
    } else if (selectedChart === "height") {
      dataset = {
        label: "Chiều cao (cm)",
        data: interp.heightSeries,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: createGradient(
          "rgba(59, 130, 246, 0.4)",
          "rgba(59, 130, 246, 0.0)"
        ),
        pointBorderColor: "rgb(59, 130, 246)",
      };
    } else {
      dataset = {
        label: "Cân nặng (kg)",
        data: interp.weightSeries,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: createGradient(
          "rgba(34, 197, 94, 0.4)",
          "rgba(34, 197, 94, 0.0)"
        ),
        pointBorderColor: "rgb(34, 197, 94)",
      };
    }

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: interp.labels,
        datasets: [{ ...dataset, ...commonOptions }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => `Tháng: ${items[0].label}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#9ca3af", font: { size: 11 } },
          },
          y: {
            beginAtZero: false,
            border: { dash: [4, 4] },
            grid: { color: "#f3f4f6" },
            ticks: { color: "#9ca3af", font: { size: 11 } },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      chartInstance.current?.destroy();
    };
  }, [selectedChart, historyData]);

  const tabs = [
    {
      key: "bmi",
      label: "BMI",
      icon: Activity,
      activeColor: "text-purple-600 bg-white shadow-sm ring-1 ring-black/5",
    },
    {
      key: "height",
      label: "Chiều cao",
      icon: Ruler,
      activeColor: "text-blue-600 bg-white shadow-sm ring-1 ring-black/5",
    },
    {
      key: "weight",
      label: "Cân nặng",
      icon: Weight,
      activeColor: "text-green-600 bg-white shadow-sm ring-1 ring-black/5",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Biểu đồ phát triển
          </h3>
          <p className="text-sm text-gray-500">
            Theo dõi xu hướng theo thời gian
          </p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl">
          {tabs.map((tab) => {
            const isActive = selectedChart === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedChart(tab.key as any)}
                className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                            ${
                              isActive
                                ? tab.activeColor
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }
                        `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-80 w-full relative">
        {historyData.length > 0 ? (
          <canvas ref={chartRef} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Activity size={32} className="mb-2 opacity-50" />
            Chưa có dữ liệu lịch sử để vẽ biểu đồ
          </div>
        )}
      </div>
    </div>
  );
}
