"use client";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { HealthPoint, StudentBMIResultDto } from "@/types/parent";
import HealthStats from "@/components/parents/health/HealthStats";
import HealthChart from "@/components/parents/health/HealthChart";
import { formatMonth } from "@/helpers";
import { useSelectedStudent } from "@/context/SelectedChildContext";
import { HeartPulse, Activity, Baby } from "lucide-react";
import { studentHealthService } from "@/services/parent/studentHealth.service";

export default function HealthPage() {
  const { selectedStudent } = useSelectedStudent();

  const [historyData, setHistoryData] = useState<HealthPoint[]>([]);
  const [currentHealth, setCurrentHealth] =
    useState<StudentBMIResultDto | null>(null);
  const [selectedChart, setSelectedChart] = useState<
    "bmi" | "height" | "weight"
  >("bmi");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedStudent?.studentId) return;

    const fetchHealthData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [currentData, historyDataRes] = await Promise.all([
          studentHealthService.getCurrentHealth(selectedStudent.studentId),
          studentHealthService.getHealthHistory(selectedStudent.studentId),
        ]);
        setCurrentHealth(currentData);

        const formattedHistory: HealthPoint[] = (historyDataRes || []).map(
          (item) => ({
            month: formatMonth(item.recordAt),
            height: item.heightCm,
            weight: item.weightKg,
            bmi: item.bmi,
          })
        );

        setHistoryData(formattedHistory);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setCurrentHealth(null);
          setHistoryData([]);
        } else {
          console.error("Lỗi tải dữ liệu sức khỏe:", err);
          setError("Không thể tải dữ liệu sức khỏe. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [selectedStudent?.studentId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-100 rounded-xl text-rose-500">
            <HeartPulse size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Sổ theo dõi sức khỏe
            </h2>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
        <div className="bg-gray-100 h-96 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 rounded-xl text-rose-600 shadow-sm">
          <HeartPulse size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Sổ theo dõi sức khỏe
          </h2>
          <p className="text-gray-500 text-sm">
            Cập nhật các chỉ số phát triển thể chất của bé
          </p>
        </div>
      </div>

      {!selectedStudent ? (
        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Baby size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            Chưa chọn học sinh
          </h3>
          <p className="text-gray-500 mt-2">
            Vui lòng chọn bé từ danh sách bên trái để xem dữ liệu.
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <Activity className="mx-auto text-red-500 mb-2" size={32} />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl text-gray-800">
              Chỉ số mới nhất của{" "}
              <span className="text-rose-600">{selectedStudent.fullName}</span>
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Cập nhật lần cuối:{" "}
              {currentHealth?.recordAt &&
                new Date(currentHealth.recordAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {!currentHealth && historyData.length === 0 ? (
            <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p>
                Chưa có dữ liệu sức khỏe nào được ghi nhận cho học sinh này.
              </p>
            </div>
          ) : (
            <>
              <HealthStats currentHealth={currentHealth} />

              <div className="mt-8">
                <HealthChart
                  historyData={historyData}
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
