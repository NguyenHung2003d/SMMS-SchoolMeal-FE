"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Users,
  Calendar,
  UserCheck,
  AlertCircle,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { wardenClassService } from "@/services/wardenClassView.service";
import { StudentDto, AttendanceSummaryDto } from "@/types/warden";
import { formatDateForInput } from "@/helpers";

interface ClassDetailModalProps {
  classId: string | null;
  isOpen: boolean;
  onClose: () => void;
  classNameTitle?: string;
}

export default function ClassDetailModal({
  classId,
  isOpen,
  onClose,
  classNameTitle,
}: ClassDetailModalProps) {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && classId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [studentsData, attendanceData] = await Promise.all([
            wardenClassService.getStudentsInClass(classId),
            wardenClassService.getClassAttendance(classId),
          ]);
          setStudents(studentsData);
          setSummary(attendanceData.summary);
        } catch (error) {
          console.error("Lỗi tải chi tiết lớp:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset khi đóng
      setStudents([]);
      setSummary(null);
      setSearchQuery("");
    }
  }, [isOpen, classId]);

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[60vw] w-[70vw] h-[70vh] max-w-none overflow-hidden flex flex-col p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100/50 flex flex-row items-center justify-between flex-shrink-0">
          <div>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              Chi tiết lớp {classNameTitle || "..."}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Danh sách học sinh và trạng thái điểm danh hôm nay
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                        Sĩ số
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        {summary.totalStudents}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <Users size={24} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                        Có mặt
                      </p>
                      <p className="text-3xl font-bold text-green-600 mt-1">
                        {summary.present}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <UserCheck size={24} />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                        Vắng mặt
                      </p>
                      <p className="text-3xl font-bold text-red-600 mt-1">
                        {summary.absent}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                      <AlertCircle size={24} />
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Tìm kiếm học sinh trong lớp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 h-10"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Học sinh
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Thông tin
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Phụ huynh
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <tr
                            key={student.studentId}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                  {student.avatarUrl ? (
                                    <img
                                      src={student.avatarUrl}
                                      alt=""
                                      className="h-10 w-10 object-cover"
                                    />
                                  ) : (
                                    <span>
                                      {student.gender === "Nam" ||
                                      student.gender === "Male"
                                        ? "👦"
                                        : "👧"}
                                    </span>
                                  )}
                                </div>
                                <div className="font-medium text-gray-900">
                                  {student.fullName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                      student.gender === "Nam" ||
                                      student.gender === "Male"
                                        ? "bg-blue-400"
                                        : "bg-pink-400"
                                    }`}
                                  ></span>
                                  <span>{student.gender}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Calendar
                                    size={14}
                                    className="flex-shrink-0"
                                  />
                                  <span>
                                    {formatDateForInput(student.dateOfBirth)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {student.parentName || "---"}
                                </p>
                                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                  {student.parentPhone || "---"}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {student.isAbsent ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                  Vắng mặt
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                  Có mặt
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-16 text-center text-gray-500"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <Search className="h-10 w-10 text-gray-300 mb-2" />
                              <p>Không tìm thấy học sinh nào.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
