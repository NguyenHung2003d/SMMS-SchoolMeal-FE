"use client";
import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { HealthPoint, StudentBMIResultDto } from "@/types/parent";
import HealthStats from "@/components/parents/health/HealthStats";
import HealthChart from "@/components/parents/health/HealthChart";
import { toast } from "react-hot-toast"; // Gợi ý thêm toast nếu chưa có
import { formatMonth } from "@/helpers";
import { useSelectedStudent } from "@/context/SelectedChildContext";

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
        const [currentRes, historyRes] = await Promise.all([
          axiosInstance.get<StudentBMIResultDto>(
            `/StudentHealth/current/${selectedStudent.studentId}`
          ),
          axiosInstance.get<StudentBMIResultDto[]>(
            `/StudentHealth/history/${selectedStudent.studentId}`
          ),
        ]);

        setCurrentHealth(currentRes.data);

        const formattedHistory: HealthPoint[] = (historyRes.data || []).map(
          (item) => ({
            month: formatMonth(item.recordAt),
            height: item.heightCm,
            weight: item.weightKg,
            bmi: item.bmi,
          })
        );

        setHistoryData(formattedHistory);
      } catch (err) {
        console.error("Lỗi tải dữ liệu sức khỏe:", err);
        setError("Không thể tải dữ liệu sức khỏe. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [selectedStudent?.studentId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <h2 className="text-2xl font-bold text-gray-800">Theo dõi sức khỏe</h2>
        <div className="bg-white h-40 rounded-lg shadow p-6"></div>
        <div className="bg-white h-64 rounded-lg shadow p-6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Theo dõi sức khỏe</h2>

      {!selectedStudent ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                Chỉ số hiện tại -{" "}
                <span className="text-blue-600">
                  {selectedStudent.fullName}
                </span>
              </h3>
            </div>

            {!currentHealth && historyData.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                Chưa có dữ liệu sức khỏe cho học sinh này.
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
        </div>
      )}
    </div>
  );
}
