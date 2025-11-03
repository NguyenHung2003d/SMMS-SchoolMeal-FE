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

type HealthPoint = {
  month: string; // "T6", "T7", ...
  height: number; // cm
  weight: number; // kg
  bmi: number; // chỉ số BMI
};

export default function TrackBMI({ selectedChild }: any) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedBMI, setCalculatedBMI] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<
    "bmi" | "height" | "weight"
  >("bmi");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const bmi = (
        parseFloat(weight) /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setCalculatedBMI(bmi);
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: "Thiếu cân", color: "text-yellow-600" };
    if (bmi < 25) return { text: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { text: "Thừa cân", color: "text-orange-600" };
    return { text: "Béo phì", color: "text-red-600" };
  };

  // Dữ liệu gốc theo tháng (mốc thực tế)
  const healthData: HealthPoint[] = [
    { month: "T6", height: 120, weight: 20.0, bmi: 13.9 },
    { month: "T7", height: 122, weight: 21.0, bmi: 14.1 },
    { month: "T8", height: 123, weight: 21.5, bmi: 14.2 },
    { month: "T9", height: 125, weight: 22.0, bmi: 14.1 },
  ];

  // Nội suy chính xác giữa 2 tháng, mỗi tháng 3 chặng: .1 (điểm đầu), .2 (giữa), .3 (điểm cuối = tháng sau)
  function interpolateMonthly(data: HealthPoint[], segmentsPerMonth = 3) {
    const labels: string[] = [];
    const heightSeries: number[] = [];
    const weightSeries: number[] = [];
    const bmiSeries: number[] = [];

    const steps = segmentsPerMonth - 1; // với 3 chặng => 2 khoảng: 0, 0.5, 1

    for (let i = 0; i < data.length - 1; i++) {
      const a = data[i];
      const b = data[i + 1];

      for (let s = 0; s <= steps; s++) {
        // tránh trùng điểm đầu ở các tháng sau (ví dụ T7.1 trùng T6.3)
        if (i > 0 && s === 0) continue;

        const t = s / steps; // 0, 0.5, 1
        const label = `${a.month}.${s + 1}`;

        const h = a.height + (b.height - a.height) * t;
        const w = a.weight + (b.weight - a.weight) * t;
        const bmi = a.bmi + bmiDelta(a.bmi, b.bmi) * t;

        labels.push(label);
        // làm tròn 1 chữ số thập phân để “bước 0.1” rõ ràng
        heightSeries.push(Number(h.toFixed(1)));
        weightSeries.push(Number(w.toFixed(1)));
        bmiSeries.push(Number(bmi.toFixed(1)));
      }
    }

    return { labels, heightSeries, weightSeries, bmiSeries };
  }

  // cho phép delta âm/dương, nội suy tuyến tính BMI
  const bmiDelta = (from: number, to: number) => to - from;

  // dataset theo loại người dùng chọn
  const getDataset = (interp: ReturnType<typeof interpolateMonthly>) => {
    switch (selectedChart) {
      case "bmi":
        return [
          {
            label: "BMI",
            data: interp.bmiSeries,
            borderColor: "rgb(147, 51, 234)",
            backgroundColor: "rgba(147, 51, 234, 0.1)",
            tension: 0.35,
            pointRadius: 3,
          },
        ];
      case "height":
        return [
          {
            label: "Chiều cao (cm)",
            data: interp.heightSeries,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.35,
            pointRadius: 3,
          },
        ];
      case "weight":
        return [
          {
            label: "Cân nặng (kg)",
            data: interp.weightSeries,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.35,
            pointRadius: 3,
          },
        ];
    }
  };

  useEffect(() => {
    if (!chartRef.current || !selectedChild) return;

    // Hủy biểu đồ cũ
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Đăng ký các thành phần Chart.js
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

    // Nội suy 3 chặng/tháng
    const interp = interpolateMonthly(healthData, 3);

    // Dựng chart 1 đường theo selectedChart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: interp.labels, // T6.1, T6.2, T6.3, T7.2, ...
        datasets: getDataset(interp),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            labels: { usePointStyle: true, padding: 12 },
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: 10,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                if (selectedChart === "height") return `Chiều cao: ${val} cm`;
                if (selectedChart === "weight") return `Cân nặng: ${val} kg`;
                return `BMI: ${val}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Tháng (chia chặng)" },
            grid: { display: false },
          },
          y: {
            title: {
              display: true,
              text:
                selectedChart === "bmi"
                  ? "BMI"
                  : selectedChart === "height"
                  ? "Chiều cao (cm)"
                  : "Cân nặng (kg)",
            },
            // gợi ý biên để đẹp mắt
            ticks: {
              // luôn hiển thị 1 chữ số thập phân cho cảm giác “bước 0.1”
              callback: (value) => Number(value as number).toFixed(1),
            },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
        },
      },
    });

    // cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [selectedChild, selectedChart]); // nhớ thêm selectedChart để đổi nút là vẽ lại

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
              Chỉ số hiện tại - {selectedChild.name}
            </h3>

            {/* Nút chọn loại biểu đồ */}
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

            {/* Biểu đồ */}
            <div className="bg-white rounded-lg border p-4">
              <div className="h-80">
                <canvas ref={chartRef} />
              </div>
            </div>

            {/* Tính BMI */}
            <div className="border-t pt-4 mt-6">
              <h4 className="font-semibold mb-3">Tính toán BMI</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="125"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="22"
                  />
                </div>
              </div>

              {calculatedBMI && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Chỉ số BMI</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {calculatedBMI}
                  </p>
                  <p
                    className={`text-lg font-semibold mt-2 ${
                      getBMIStatus(parseFloat(calculatedBMI)).color
                    }`}
                  >
                    {getBMIStatus(parseFloat(calculatedBMI)).text}
                  </p>
                </div>
              )}

              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-600">Công thức BMI:</strong> BMI
                  = Cân nặng (kg) ÷ [Chiều cao (m)]²
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Ví dụ: 22kg, 1.25m → BMI = 22 ÷ (1.25)² = 14.1
                </p>
              </div>

              <button
                onClick={calculateBMI}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Tính BMI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
