"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { HealthPoint, StudentBMIResultDto, TrackBMIProps } from "@/types/BMI";
import { axiosInstance } from "@/lib/axiosInstance";
import { getBMIStatus } from "@/helpers";

export default function TrackBMI({ selectedChild }: TrackBMIProps) {
  const [historyData, setHistoryData] = useState<HealthPoint[]>([]);
  const [currentHealth, setCurrentHealth] =
    useState<StudentBMIResultDto | null>(null);

  const [selectedChart, setSelectedChart] = useState<
    "bmi" | "height" | "weight"
  >("bmi");

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  function interpolateMonthly(data: HealthPoint[], segmentsPerMonth = 3) {
    const labels: string[] = [];
    const heightSeries: number[] = [];
    const weightSeries: number[] = [];
    const bmiSeries: number[] = [];

    if (!data || data.length === 0) {
      return { labels, heightSeries, weightSeries, bmiSeries };
    }

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
        const h = a.height + (b.height - a.height) * t;
        const w = a.weight + (b.weight - a.weight) * t;
        const bmi = a.bmi + (b.bmi - a.bmi) * t;
        labels.push(label);
        heightSeries.push(Number(h.toFixed(1)));
        weightSeries.push(Number(w.toFixed(1)));
        bmiSeries.push(Number(bmi.toFixed(1)));
      }
    }
    const last = data[data.length - 1];
    labels.push(last.month);
    heightSeries.push(last.height);
    weightSeries.push(last.weight);
    bmiSeries.push(last.bmi);
    return { labels, heightSeries, weightSeries, bmiSeries };
  }

  const getDataset = (interp: ReturnType<typeof interpolateMonthly>) => {
    const commonOptions = {
      tension: 0.35,
      pointRadius: (ctx: any) => {
        if (interp.labels.length === 1) return 6;
        return ctx.raw && ctx.dataIndex % 3 === 0 ? 4 : 0;
      },
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
    if (!selectedChild?.studentId) return;
    const fetchHealthData = async () => {
      try {
        const currentRes = await axiosInstance.get<StudentBMIResultDto>(
          `/StudentHealth/current/${selectedChild.studentId}`
        );
        console.log("Raw History Data:", currentRes.data);
        setCurrentHealth(currentRes.data);
        const historyRes = await axiosInstance.get<StudentBMIResultDto[]>(
          `/StudentHealth/history/${selectedChild.studentId}`
        );
        const formattedHistory: HealthPoint[] = historyRes.data.map((item) => {
          const date = new Date(item.recordAt);
          return {
            month: `T${date.getMonth() + 1}/${date
              .getFullYear()
              .toString()
              .slice(2)}`,
            height: item.heightCm,
            weight: item.weightKg,
            bmi: item.bmi,
          };
        });
        setHistoryData(formattedHistory);
      } catch (error) {
        console.error("Lỗi tải dữ liệu sức khỏe:", error);
        setHistoryData([]);
        setCurrentHealth(null);
      }
    };
    fetchHealthData();
  }, [selectedChild]);

  useEffect(() => {
    if (!chartRef.current || !selectedChild) return;

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
        scales: {
          y: { beginAtZero: false },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [selectedChild, selectedChart, historyData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Theo dõi sức khỏe</h2>

      {!selectedChild ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">
              Chỉ số hiện tại - {selectedChild.fullName}
            </h3>

            {currentHealth ? (
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Chiều cao</p>
                  <p className="text-xl font-bold text-blue-600">
                    {currentHealth.heightCm} cm
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Cân nặng</p>
                  <p className="text-xl font-bold text-green-600">
                    {currentHealth.weightKg} kg
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-xl font-bold text-purple-600">
                    {currentHealth.bmi}
                  </p>
                  <span
                    className={`text-xs font-bold ${
                      getBMIStatus(currentHealth.bmi).color
                    }`}
                  >
                    {getBMIStatus(currentHealth.bmi).text}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6">
                Chưa có dữ liệu sức khỏe mới nhất.
              </p>
            )}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedChart("bmi")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChart === "bmi"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                BMI
              </button>
              <button
                onClick={() => setSelectedChart("height")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChart === "height"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Chiều cao
              </button>
              <button
                onClick={() => setSelectedChart("weight")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChart === "weight"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Cân nặng
              </button>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="h-80">
                {historyData.length > 0 ? (
                  <canvas ref={chartRef} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Chưa có dữ liệu lịch sử để vẽ biểu đồ
                  </div>
                )}{" "}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
