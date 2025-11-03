"use client";
import { MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function StatsOverview({
  pendingCount,
  inProgressCount,
  resolvedCount,
  highSeverityCount,
}: {
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  highSeverityCount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Pending */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Phản hồi mới
            </p>
            <h3 className="text-3xl font-bold text-gray-800">{pendingCount}</h3>
            <p className="mt-2 text-sm text-gray-600">Chưa xử lý</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <MessageCircle size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Đang xử lý</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {inProgressCount}
            </h3>
            <p className="mt-2 text-sm text-gray-600">Cần hoàn thành</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Clock size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Đã giải quyết
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {resolvedCount}
            </h3>
            <p className="mt-2 text-sm text-gray-600">Phản hồi đã xử lý</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* High Severity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Mức độ nghiêm trọng cao
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {highSeverityCount}
            </h3>
            <p className="mt-2 text-sm text-gray-600">Cần ưu tiên xử lý</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
