"use client";
import React, { useEffect, useState } from "react";
import { useSelectedChild } from "@/context/SelectedChildContext";
import { axiosInstance } from "@/lib/axiosInstance";
import { HealthPoint, StudentBMIResultDto } from "@/types/parent";
import HealthStats from "@/components/parents/health/HealthStats";
import HealthChart from "@/components/parents/health/HealthChart";

export default function HealthPage() {
  const { selectedChild } = useSelectedChild();

  const [historyData, setHistoryData] = useState<HealthPoint[]>([]);
  const [currentHealth, setCurrentHealth] =
    useState<StudentBMIResultDto | null>(null);
  const [selectedChart, setSelectedChart] = useState<
    "bmi" | "height" | "weight"
  >("bmi");

  useEffect(() => {
    if (!selectedChild?.studentId) return;

    const fetchHealthData = async () => {
      try {
        const currentRes = await axiosInstance.get<StudentBMIResultDto>(
          `/StudentHealth/current/${selectedChild.studentId}`
        );
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

            <HealthStats currentHealth={currentHealth} />

            <HealthChart
              historyData={historyData}
              selectedChart={selectedChart}
              setSelectedChart={setSelectedChart}
            />
          </div>
        </div>
      )}
    </div>
  );
}
