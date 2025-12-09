import React from "react";
import { getBMIStatus } from "@/helpers";
import { HealthStatsProps } from "@/types/parent";
import { Ruler, Weight, Activity, TrendingUp } from "lucide-react";

export default function HealthStats({ currentHealth }: HealthStatsProps) {
  if (!currentHealth) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500 italic border border-dashed border-gray-300">
        Chưa có dữ liệu sức khỏe mới nhất.
      </div>
    );
  }

  const bmiStatus = getBMIStatus(currentHealth.bmi);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Ruler size={80} className="text-blue-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Ruler size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Chiều cao
            </p>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="text-3xl font-bold text-gray-800">
              {currentHealth.heightCm}
            </p>
            <span className="text-gray-500 font-medium">cm</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Weight size={80} className="text-green-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Weight size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Cân nặng
            </p>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="text-3xl font-bold text-gray-800">
              {currentHealth.weightKg}
            </p>
            <span className="text-gray-500 font-medium">kg</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-green-50 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Activity size={80} className="text-purple-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Activity size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Chỉ số BMI
            </p>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-800">
              {currentHealth.bmi}
            </p>
            <div
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border ${bmiStatus.color
                .replace("text-", "bg-")
                .replace("600", "100")
                .replace("700", "100")} ${bmiStatus.color}`}
            >
              <TrendingUp size={12} /> {bmiStatus.text}
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-purple-50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
