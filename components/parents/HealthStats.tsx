import React from "react";
import { getBMIStatus } from "@/helpers";
import { HealthStatsProps } from "@/types/parent";

export default function HealthStats({ currentHealth }: HealthStatsProps) {
  if (!currentHealth) {
    return (
      <p className="text-gray-500 italic mb-6">
        Chưa có dữ liệu sức khỏe mới nhất.
      </p>
    );
  }

  const bmiStatus = getBMIStatus(currentHealth.bmi);

  return (
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
        <span className={`text-xs font-bold ${bmiStatus.color}`}>
          {bmiStatus.text}
        </span>
      </div>
    </div>
  );
}