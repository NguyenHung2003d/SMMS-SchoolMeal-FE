"use client";
import React from "react";
import { Plus, History } from "lucide-react";
import { format } from "date-fns";
import { HealthRecord } from "@/types/warden-health";

interface StudentHealthTableProps {
  data: HealthRecord[];
  onUpdate: (student: HealthRecord) => void;
  onViewHistory: (student: HealthRecord) => void;
}

export const StudentHealthTable: React.FC<StudentHealthTableProps> = ({
  data,
  onUpdate,
  onViewHistory,
}) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-800">Danh sách học sinh</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Học sinh</th>
              <th className="px-6 py-3 font-semibold text-center">
                Chiều cao (cm)
              </th>
              <th className="px-6 py-3 font-semibold text-center">
                Cân nặng (kg)
              </th>
              <th className="px-6 py-3 font-semibold text-center">BMI</th>
              <th className="px-6 py-3 font-semibold text-center">
                Trạng thái
              </th>
              <th className="px-6 py-3 font-semibold text-center">Ngày đo</th>
              <th className="px-6 py-3 font-semibold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((student) => {
              const statusColor = !student.bmi
                ? "bg-gray-100 text-gray-500"
                : student.bmi < 18.5
                ? "bg-blue-100 text-blue-700"
                : student.bmi < 25
                ? "bg-green-100 text-green-700"
                : student.bmi < 30
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-700";

              const statusText = !student.bmi
                ? "Chưa đo"
                : student.bmi < 18.5
                ? "Thiếu cân"
                : student.bmi < 25
                ? "Bình thường"
                : student.bmi < 30
                ? "Thừa cân"
                : "Béo phì";

              return (
                <tr
                  key={student.studentId}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.heightCm || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.weightKg || "-"}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold">
                    {student.bmi?.toFixed(1) || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.recordDate
                      ? format(new Date(student.recordDate), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onUpdate(student)}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Cập nhật mới"
                      >
                        <Plus size={18} />
                      </button>
                      <button
                        onClick={() => onViewHistory(student)}
                        className="rounded p-1.5 text-orange-600 hover:bg-orange-50 transition-colors"
                        title="Xem lịch sử"
                      >
                        <History size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Chưa có dữ liệu học sinh.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
