"use client";
import { Line, Bar } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardCharts() {
  // Doanh thu theo tháng
  const revenueData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [3.2, 3.8, 4.5, 5.1, 5.8, 6.3],
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.4)",
        tension: 0.4,
      },
    ],
  };

  // Tăng trưởng người dùng
  const userGrowthData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Người dùng mới",
        data: [300, 450, 600, 700, 800, 1000],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  // Số lượng sự cố
  const incidentData = {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    datasets: [
      {
        label: "Sự cố hệ thống",
        data: [5, 3, 8, 2],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Biểu đồ doanh thu */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="font-bold mb-4">Doanh thu theo tháng</h3>
        <Line data={revenueData} />
      </div>

      {/* Biểu đồ người dùng */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="font-bold mb-4">Tăng trưởng người dùng</h3>
        <Bar data={userGrowthData} />
      </div>

      {/* Biểu đồ sự cố */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="font-bold mb-4">Số lượng sự cố</h3>
        <Bar data={incidentData} />
      </div>
    </div>
  );
}