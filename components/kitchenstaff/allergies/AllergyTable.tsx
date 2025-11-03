"use client";

import { studentAllergies } from "@/data";
import { AlertCircle, Search } from "lucide-react";

export default function AllergyTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium">Danh sách học sinh có dị ứng</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Học sinh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lớp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dị ứng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mức độ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentAllergies.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <img
                    src={student.image}
                    alt={student.student}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <span className="font-medium text-gray-900">
                    {student.student}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Lớp {student.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {student.allergies.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                      student.severity === "Cao"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {student.severity}
                  </span>
                </td>
                <td className="px-6 py-4">{student.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
