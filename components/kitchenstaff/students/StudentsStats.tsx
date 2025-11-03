"use client";
import { Users, User, AlertCircle } from "lucide-react";

export default function StudentsStats({
  totalStudents,
  presentStudents,
  specialRequests,
}: {
  totalStudents: number;
  presentStudents: number;
  specialRequests: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Tổng số học sinh */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Tổng số học sinh
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {totalStudents}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Đăng ký bữa trưa hôm nay
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Có mặt hôm nay */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Có mặt hôm nay
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {presentStudents}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Tỷ lệ điểm danh:{" "}
              {Math.round((presentStudents / totalStudents) * 100)}%
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <User size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Yêu cầu đặc biệt */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Yêu cầu đặc biệt
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {specialRequests}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Dị ứng và chế độ ăn đặc biệt
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <AlertCircle size={24} className="text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
