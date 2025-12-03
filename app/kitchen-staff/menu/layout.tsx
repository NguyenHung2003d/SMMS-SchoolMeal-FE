"use client";
import Link from "next/link";
import {
  Plus,
  Download,
} from "lucide-react";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thực đơn</h1>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <Download size={18} className="mr-2" />
            <span>Xuất Excel</span>
          </button>

          <Link
            href="/kitchen-staff/menu/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            <span>Tạo thực đơn mới</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-100">
        <div className="p-4 flex justify-end items-center bg-gray-50/30">
          {/* === CỤM CONTROL BÊN PHẢI === */}
          <div className="flex items-center space-x-3">
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm 
          focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="main">Món chính</option>
              <option value="dessert">Tráng miệng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-[500px]">{children}</div>
    </div>
  );
}
