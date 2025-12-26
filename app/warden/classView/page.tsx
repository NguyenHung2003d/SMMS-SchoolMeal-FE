"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  Download,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { wardenDashboardService } from "@/services/wardens/wardenDashborad.service";
import { wardenClassService } from "@/services/wardens/wardenClassView.service";
import { formatDate } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function TeacherClassView() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["wardenClasses"],
    queryFn: wardenDashboardService.getClasses,
    staleTime: 1000 * 60 * 30,
  });

  const selectedClassId =
    classes && classes.length > 0 ? classes[0].classId.toString() : null;

  const { data: classData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["wardenClassDetail", selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return null;
      const [studentsData, attendanceData] = await Promise.all([
        wardenClassService.getStudentsInClass(selectedClassId),
        wardenClassService.getClassAttendance(selectedClassId),
      ]);
      return {
        students: studentsData,
        summary: attendanceData.summary,
        className: attendanceData.className,
      };
    },
    enabled: !!selectedClassId,
  });

  const filteredStudents = React.useMemo(() => {
    if (!classData?.students) return [];
    if (!searchQuery.trim()) return classData.students;

    const lowerQuery = searchQuery.toLowerCase();
    return classData.students.filter((s) =>
      s.fullName.toLowerCase().includes(lowerQuery)
    );
  }, [classData?.students, searchQuery]);

  const handleExport = async () => {
    if (!selectedClassId) return;
    try {
      const blob = await wardenClassService.exportClassReport(selectedClassId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DanhSach_Lop_${classData?.className || "BaoCao"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("Xuất file thất bại");
    }
  };

  if (isLoadingClasses || (selectedClassId && isLoadingDetails)) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">
          Chưa có thông tin lớp học
        </h2>
        <p className="text-gray-500">
          Bạn chưa được phân công quản lý lớp nào.
        </p>
      </div>
    );
  }

  const { summary, className } = classData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {className ? `Lớp ${className}` : "Danh sách lớp"}
            </h1>
            <p className="text-gray-500 mt-1">Quản lý danh sách và điểm danh</p>
          </div>

          <div className="bg-white p-1 rounded-2xl shadow-sm border border-orange-100 w-full md:w-auto">
            <div className="relative w-full md:w-[350px]">
              <input
                type="text"
                placeholder="Tìm kiếm tên học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-sm"
              />
              <div className="absolute left-3.5 top-2.5 text-gray-400">
                <Search size={20} />
              </div>
            </div>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsBox
              label="Tổng số học sinh"
              value={summary.totalStudents}
              icon={<Users size={32} className="text-white" />}
              gradient="from-blue-500 to-blue-600"
              shadow="shadow-blue-200"
              textColor="text-blue-100"
            />
            <StatsBox
              label="Có mặt hôm nay"
              value={summary.present}
              subValue={`/${summary.totalStudents}`}
              icon={<UserCheck size={32} className="text-white" />}
              gradient="from-green-500 to-green-600"
              shadow="shadow-green-200"
              textColor="text-green-100"
            />
            <StatsBox
              label="Vắng mặt"
              value={summary.absent}
              icon={<AlertCircle size={32} className="text-white" />}
              gradient="from-red-500 to-red-600"
              shadow="shadow-red-200"
              textColor="text-red-100"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 overflow-hidden border border-orange-100/50">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-orange-500" size={24} />
              Danh sách học sinh{" "}
              <span className="text-sm font-normal text-gray-500">
                ({filteredStudents.length})
              </span>
            </h2>
            <Button
              onClick={handleExport}
              variant="outline"
              className="gap-2 text-sm hover:text-orange-600 hover:border-orange-200"
            >
              <Download size={16} />
              Xuất Excel
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Phụ huynh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Lưu ý
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.avatarUrl ? (
                            <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-full border border-gray-100 shadow-sm">
                              <Image
                                src={student.avatarUrl}
                                alt={student.fullName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 mr-3 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-200 shadow-sm">
                              {student.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">
                              {student.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              student.gender === "Nam" ||
                              student.gender === "Male"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-pink-100 text-pink-700"
                            }`}
                          >
                            {student.gender || "N/A"}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(student.dateOfBirth)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {student.parentName || "Chưa cập nhật"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.parentPhone || ""}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.allergies && student.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {student.allergies.map((allergy, idx) => (
                              <span
                                key={idx}
                                className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-medium border border-red-100"
                              >
                                <AlertCircle size={10} /> {allergy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!student.isAbsent ? (
                          <span className="px-3 py-1 inline-flex text-xs font-bold rounded-lg bg-green-100 text-green-700 border border-green-200">
                            Có mặt
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs font-bold rounded-lg bg-red-100 text-red-700 border border-red-200">
                            Vắng mặt
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Search className="text-gray-400" size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Không tìm thấy học sinh nào phù hợp
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatsBox = ({
  label,
  value,
  subValue,
  icon,
  gradient,
  shadow,
  textColor,
}: any) => (
  <div
    className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg ${shadow} p-6 text-white transform hover:scale-[1.02] transition-transform`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={`${textColor} text-sm font-medium mb-1`}>{label}</p>
        <p className="text-4xl font-bold">
          {value}
          {subValue && (
            <span className={`text-2xl ${textColor}`}>{subValue}</span>
          )}
        </p>
      </div>
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">{icon}</div>
    </div>
  </div>
);
