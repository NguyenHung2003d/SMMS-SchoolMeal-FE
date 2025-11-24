import React from "react";
import {
  Users,
  School,
  BookOpen,
  DollarSign,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { ManagerOverviewDto } from "@/types/manager";
import { formatCurrency, formatNumber } from "@/helpers";

interface StatsGridProps {
  overview: ManagerOverviewDto | null;
}

export default function StatsGrid({ overview }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Card 1: Giáo viên */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Quản sinh / GV
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {overview?.teacherCount || 0}
            </h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Card 2: Học sinh */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Học sinh</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {formatNumber(overview?.studentCount || 0)}
            </h3>
            <p className="mt-2 text-sm flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <TrendingUp size={14} className="mr-0.5" />{" "}
                {overview?.studentGrowth}%
              </span>
              <span className="text-gray-500">so với tháng trước</span>
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <School size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Card 3: Lớp học */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Lớp học</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {overview?.classCount || 0}
            </h3>
            <p className="mt-2 text-sm flex items-center">
              <span className="text-blue-500 flex items-center mr-1">
                <CheckCircle size={14} className="mr-0.5" />
                {overview?.assignedClasses || 0}
              </span>
              <span className="text-gray-500">lớp đã có GVCN</span>
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <BookOpen size={24} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Card 4: Tài chính */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Doanh thu tháng
            </p>
            <h3
              className="text-3xl font-bold text-gray-800"
              title={formatCurrency(overview?.financeThisMonth || 0)}
            >
              {formatCurrency(overview?.financeThisMonth || 0)}
            </h3>
            <p className="mt-2 text-sm flex items-center">
              <span
                className={`${
                  (overview?.financeChangePercent || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                } flex items-center mr-1`}
              >
                <TrendingUp size={14} className="mr-0.5" />{" "}
                {overview?.financeChangePercent}%
              </span>
              <span className="text-gray-500">so với tháng trước</span>
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <DollarSign size={24} className="text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
