import React from "react";
import {
  Users,
  Activity,
  Image,
  AlertCircle,
  UserCheck,
  FileText,
} from "lucide-react";
import Link from "next/link";

export function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-orange-400 text-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold mb-2">1</h3>
            <p className="text-sm text-center">Lớp học đang quản lý</p>
          </div>
        </div>
        <div className="bg-orange-400 text-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold mb-2">28</h3>
            <p className="text-sm text-center">Tổng số học sinh</p>
          </div>
        </div>
        <div className="bg-orange-400 text-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold mb-2">25</h3>
            <p className="text-sm text-center">Có mặt hôm nay</p>
          </div>
        </div>
        <div className="bg-orange-400 text-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl font-bold mb-2">3</h3>
            <p className="text-sm text-center">Vấn đề cần xử lý</p>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/wardens/classView"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Users size={32} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Xem lớp học</h3>
            <p className="text-sm text-gray-600">
              Xem danh sách và thông tin học sinh trong lớp
            </p>
          </div>
        </Link>

        <Link
          href="/wardens/health"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <Activity size={32} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Theo dõi sức khỏe</h3>
            <p className="text-sm text-gray-600">
              Cập nhật và theo dõi chỉ số BMI của học sinh
            </p>
          </div>
        </Link>

        <Link
          href="/wardens/gallery"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Image size={32} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Quản lý ảnh</h3>
            <p className="text-sm text-gray-600">
              Tải lên và quản lý ảnh hoạt động của học sinh
            </p>
          </div>
        </Link>

        <Link
          href="/wardens/issues"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Báo cáo vấn đề</h3>
            <p className="text-sm text-gray-600">
              Gửi báo cáo về các vấn đề phát sinh
            </p>
          </div>
        </Link>
      </div>

      {/* Class Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Tổng quan lớp học</h2>
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">Lớp 1A</h3>
              <p className="text-sm text-gray-600">Chủ nhiệm: Cô Lan Anh</p>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Sáng
            </div>
          </div>
          <div className="flex items-center text-sm mb-2">
            <Users size={16} className="text-gray-500 mr-2" />
            <span>28 học sinh</span>
          </div>
          <div className="flex items-center text-sm">
            <UserCheck size={16} className="text-green-500 mr-2" />
            <span>25 có mặt hôm nay</span>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/wardens/class"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >                                                               
              <FileText size={14} className="mr-1" />
              Xem chi tiết lớp học
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
