"use client";

import React, { useState, useEffect } from "react";
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
import { AttendanceSummaryDto, StudentDto } from "@/types/warden";
import { formatDateForInput } from "@/helpers";
import { getWardenIdFromToken } from "@/utils";
import { wardenDashboardService } from "@/services/wardenDashboradServices";
import { wardenClassService } from "@/services/wardenClassViewServices";

export default function TeacherClassView() {
  const [loading, setLoading] = useState(true);

  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initializeClass = async () => {
      const storedClassId = localStorage.getItem("currentClassId");

      if (storedClassId) {
        setClassId(storedClassId);
      } else {
        try {
          const wardenId = getWardenIdFromToken();
          if (wardenId) {
            const classes = await wardenDashboardService.getClasses();

            if (classes && classes.length > 0) {
              const defaultClassId = classes[0].classId.toString();
              setClassId(defaultClassId);
              localStorage.setItem("currentClassId", defaultClassId);
            } else {
              console.warn("Giáo viên này chưa được phân công lớp nào.");
              setLoading(false);
            }
          } else {
            console.error("Không tìm thấy Warden ID trong token");
            setLoading(false);
          }
        } catch (error) {
          console.error("Lỗi khi tự động lấy danh sách lớp:", error);
          setLoading(false);
        }
      }
    };

    initializeClass();
  }, []);

  useEffect(() => {
    if (!classId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsData, attendanceData] = await Promise.all([
          wardenClassService.getStudentsInClass(classId),
          wardenClassService.getClassAttendance(classId),
        ]);
        setStudents(studentsData);
        setSummary(attendanceData.summary);
        setClassName(attendanceData.className || "...");
      } catch (error) {
        console.error("Lỗi tải dữ liệu lớp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) return;
    setLoading(true);

    try {
      if (!searchQuery.trim()) {
        const data = await wardenClassService.getStudentsInClass(classId);
        setStudents(data);
      } else {
        const response = await wardenClassService.searchStudents(
          classId,
          searchQuery
        );

        const rawList = response?.students || response?.Students || [];

        const mappedStudents: StudentDto[] = rawList.map((item: any) => ({
          studentId: item.studentId || item.StudentId,
          fullName: item.fullName || item.FullName,
          gender: item.gender || item.Gender,
          dateOfBirth: item.dateOfBirth || item.DateOfBirth,
          parentName: item.parentName || item.ParentName,

          parentPhone: "",
          relationName: "",
          avatarUrl: "",
          allergies: [],
          isAbsent: false,
          isActive: true,
        }));

        console.log("Search Result:", mappedStudents);
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!classId) return;
    try {
      const blob = await wardenClassService.exportClassReport(classId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DanhSach_Lop.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("Xuất file thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!classId && !loading) {
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {className ? `Lớp ${className}` : "Danh sách lớp"}
            </h1>
            <p className="text-gray-500 mt-1">Quản lý danh sách và điểm danh</p>
          </div>
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-orange-100">
            <form
              onSubmit={handleSearch}
              className="relative w-full md:w-[350px]"
            >
              <input
                type="text"
                placeholder="Tìm kiếm tên học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-2.5 text-gray-400 hover:text-orange-500"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Tổng số học sinh
                  </p>
                  <p className="text-4xl font-bold">{summary.totalStudents}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Users size={32} className="text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-200 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">
                    Có mặt hôm nay
                  </p>
                  <p className="text-4xl font-bold">
                    {summary.present}
                    <span className="text-2xl text-green-100">
                      /{summary.totalStudents}
                    </span>
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <UserCheck size={32} className="text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-200 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">
                    Vắng mặt
                  </p>
                  <p className="text-4xl font-bold">{summary.absent}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <AlertCircle size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 overflow-hidden border border-orange-100/50">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-orange-500" size={24} />
                Danh sách học sinh
              </h2>
              <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2 text-sm"
              >
                <Download size={16} />
                Xuất Excel
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Giới tính / Ngày sinh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Phụ huynh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Lưu ý / Dị ứng
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-4 ring-2 ring-orange-100">
                            <img
                              src={
                                student.avatarUrl ||
                                "https://ui-avatars.com/api/?name=" +
                                  student.fullName
                              }
                              alt={student.fullName}
                              className="h-full w-full object-cover"
                            />
                          </div>
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
                            {formatDateForInput(student.dateOfBirth)}
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
                          <span className="px-4 py-2 inline-flex text-sm font-bold rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200">
                            ✓ Có mặt
                          </span>
                        ) : (
                          <span className="px-4 py-2 inline-flex text-sm font-bold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200">
                            ✕ Vắng mặt
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
                        Không tìm thấy học sinh nào
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
