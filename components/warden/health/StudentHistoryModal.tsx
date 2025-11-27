"use client";
import React, { useMemo } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import { HealthRecord } from "@/types/warden-health";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS locally if needed or assume it's registered globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StudentHistoryModalProps {
  open: boolean;
  student: HealthRecord | null;
  historyData: HealthRecord[];
  loading: boolean;
  onClose: () => void;
  onDelete: (recordId: string) => void;
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
  open,
  student,
  historyData,
  loading,
  onClose,
  onDelete,
}) => {
  if (!open || !student) return null;

  const historyChartData = useMemo(() => {
    return {
      labels: historyData.map((r) =>
        format(new Date(r.recordDate), "dd/MM/yy")
      ),
      datasets: [
        {
          label: "Diễn biến BMI",
          data: historyData.map((r) => r.bmi),
          borderColor: "#F97316", // Orange
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#F97316",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [historyData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b bg-orange-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Lịch sử phát triển
            </h3>
            <p className="text-sm text-orange-600 font-medium">
              {student.studentName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/50 text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-orange-500" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Biểu đồ lịch sử */}
              <div className="h-[250px] w-full rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
                <Line
                  data={historyChartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: false, grace: "10%" } },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>

              {/* Bảng lịch sử */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Ngày đo</th>
                      <th className="px-4 py-3 text-center">Chiều cao</th>
                      <th className="px-4 py-3 text-center">Cân nặng</th>
                      <th className="px-4 py-3 text-center">BMI</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyData.map((record) => (
                      <tr key={record.recordId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {format(new Date(record.recordDate), "dd/MM/yyyy")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.heightCm} cm
                        </td>
                        <td className="px-4 py-3 text-center">
                          {record.weightKg} kg
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-700">
                          {record.bmi?.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onDelete(record.recordId!)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Xóa bản ghi này"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {historyData.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          Chưa có lịch sử đo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
