"use client";
import { useState } from "react";
import {
  School,
  Mail,
  MapPin,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { schools } from "@/data";

export default function SchoolManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý trường học</h1>
          <p className="text-gray-500 text-sm">
            Quản lý danh sách các trường đang sử dụng dịch vụ của EduMeal
          </p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus size={18} />
          <span>Thêm trường mới</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-64 relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trường học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ xác nhận</option>
          </select>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition p-5 relative"
          >
            {/* Status */}
            <span
              className={`absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full ${
                school.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {school.status === "active" ? "Đang hoạt động" : "Chờ xác nhận"}
            </span>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {school.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin size={14} className="mr-2 text-gray-400" />
                  {school.address}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Phone size={14} className="mr-2 text-gray-400" />
                  {school.phone}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Mail size={14} className="mr-2 text-gray-400" />
                  {school.email}
                </p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-md">
                <MoreHorizontal size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Students */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm flex items-center text-gray-600">
                <Users size={16} className="mr-2 text-orange-500" />
                <span className="font-medium">{school.students}</span> học sinh
              </p>
              <button className="text-orange-500 hover:text-orange-600 text-sm font-medium border border-orange-200 px-3 py-1 rounded-lg">
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
        <p>
          Hiển thị {filteredSchools.length} / {schools.length} trường
        </p>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-md border hover:bg-gray-100">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 rounded-md border bg-orange-500 text-white">
            1
          </button>
          <button className="p-2 rounded-md border hover:bg-gray-100">2</button>
          <button className="p-2 rounded-md border hover:bg-gray-100">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
