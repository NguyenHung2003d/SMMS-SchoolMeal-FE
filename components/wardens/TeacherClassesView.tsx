'use client'
import React, { useState } from "react";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  User,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  MoreVertical,
} from "lucide-react";
import { students } from "@/data";
import { Button } from "../ui/button";

export default function TeacherClassView() {
  const [selectedClass, setSelectedClass] = useState("1A");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Xem lớp học
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý và theo dõi học sinh trong lớp
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-6 mb-6 border border-orange-100/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lớp học
                </label>
                <select
                  className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="1A">Lớp 1A</option>
                  <option value="1B">Lớp 1B</option>
                  <option value="1C">Lớp 1C</option>
                </select>
              </div>
            </div>
            <div className="relative w-full md:w-auto md:min-w-[350px]">
              <input
                type="text"
                placeholder="Tìm kiếm học sinh theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
              />
              <Search
                className="absolute left-3.5 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200 p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Tổng số học sinh
                </p>
                <p className="text-4xl font-bold">28</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Users size={32} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-200 p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Có mặt hôm nay
                </p>
                <p className="text-4xl font-bold">
                  25<span className="text-2xl text-green-100">/28</span>
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <UserCheck size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Student list */}
        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 overflow-hidden border border-orange-100/50">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-orange-500" size={24} />
                Danh sách học sinh lớp {selectedClass}
              </h2>
              <Button variant="outline" className="gap-2 text-sm">
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
                    Giới tính
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ngày sinh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Phụ huynh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden mr-4 ring-2 ring-orange-100 group-hover:ring-orange-300 transition-all">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            ID: HS{String(student.id).padStart(6, "0")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          student.gender === "Nam"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {student.bmi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {student.parent}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {student.parent}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.note ? (
                        <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-medium">
                          <AlertCircle size={16} className="text-orange-500" />
                          {student.note}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {student.present ? (
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
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 font-medium">
                Không tìm thấy học sinh nào
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
