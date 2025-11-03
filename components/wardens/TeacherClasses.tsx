'use client'
import React, { useState } from "react";
import {
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { classes } from "@/data";

export default function TeacherClasses() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-6">
      {" "}
      {/* ✅ Thêm thẻ bao ngoài */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Tạo lớp học mới
        </Button>
      </div>
      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">Tất cả thời gian</option>
              <option value="morning">Buổi sáng</option>
              <option value="afternoon">Buổi chiều</option>
              <option value="fullday">Cả ngày</option>
            </select>
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Theo tên</option>
            </select>
          </div>
        </div>
      </div>
      {/* Classes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Create new class card */}
        <div
          className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-64 hover:border-orange-400 transition-colors cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <div className="bg-orange-100 rounded-full p-4 mb-3">
            <Plus size={24} className="text-orange-500" />
          </div>
          <p className="font-medium text-gray-800">Tạo lớp học mới</p>
          <p className="text-sm text-gray-500 mt-1">Thêm lớp học và học sinh</p>
        </div>

        {/* Class cards */}
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Chủ nhiệm: {classItem.teacher}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.schedule === "Sáng"
                      ? "bg-blue-100 text-blue-800"
                      : classItem.schedule === "Chiều"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {classItem.schedule}
                </div>
              </div>
            </div>
            <div className="p-4">
              {/* Content here ... (giữ nguyên phần này) */}
            </div>
          </div>
        ))}
      </div>
      {/* Create class modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Tạo lớp học mới
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Modal Inputs (giữ nguyên phần này) */}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Hủy
              </Button>
              <Button>Tạo lớp học</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}