"use client";

import { Eye, AlertCircle } from "lucide-react";

export default function StudentsTable({
  students,
  activeTab,
  selectedClass,
}: {
  students: any[];
  activeTab: string;
  selectedClass: string;
}) {
  const filtered = students
    .filter((student) => {
      if (activeTab === "all") return true;
      if (activeTab === "special")
        return student.allergies.length > 0 || student.specialRequests;
      if (activeTab === "absent") return !student.present;
      return true;
    })
    .filter((student) => {
      if (selectedClass === "all") return true;
      return student.class === selectedClass;
    });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">
          {activeTab === "all" && "Danh sách học sinh"}
          {activeTab === "special" && "Học sinh có yêu cầu đặc biệt"}
          {activeTab === "absent" && "Học sinh vắng mặt hôm nay"}
        </h2>
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
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dị ứng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Yêu cầu đặc biệt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: HS00{student.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">Lớp {student.class}</td>
                <td className="px-6 py-4">
                  {student.present ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Có mặt
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Vắng mặt
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {student.allergies?.length > 0 ? (
                    <div className="flex items-center text-red-600">
                      <AlertCircle size={14} className="mr-1" />
                      <span>{student.allergies.join(", ")}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {student.note || "Không"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {student.specialRequests || "Không có"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
