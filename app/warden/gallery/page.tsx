"use client";

import React, { useState } from "react";
import { Grid, List, Loader2, Folder, Image as ImageIcon } from "lucide-react";
import { ClassDto } from "@/types/warden";
import { wardenDashboardService } from "@/services/wardens/wardenDashborad.service";
import { useQuery } from "@tanstack/react-query";
import { ClassAlbum } from "@/components/warden/gallery/ClassAlbum"; // Import component con

export default function TeacherGalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedClass, setSelectedClass] = useState<ClassDto | null>(null);

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["wardenClasses"],
    queryFn: wardenDashboardService.getClasses,
    staleTime: 1000 * 60 * 30, // 30 phút
  });

  if (selectedClass) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <ClassAlbum
          classInfo={selectedClass}
          onBack={() => setSelectedClass(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 via-white to-blue-50 min-h-screen animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thư viện ảnh</h1>
          <p className="text-gray-500 text-sm">
            Quản lý ảnh hoạt động theo lớp học
          </p>
        </div>

        <div className="bg-white border rounded-lg p-1 flex shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-orange-100 text-orange-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-orange-100 text-orange-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center h-64 items-center">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed">
          <p className="text-gray-500">
            Bạn chưa được phân công quản lý lớp nào.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((cls: any) => (
            <div
              key={cls.classId}
              onClick={() => setSelectedClass(cls)}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 group"
            >
              <div className="h-40 bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center group-hover:from-orange-200 group-hover:to-yellow-100 transition-colors relative">
                <Folder
                  size={64}
                  className="text-orange-300 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                  {cls.totalStudents} HS
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                  Lớp {cls.className}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="truncate max-w-[150px]">
                    {cls.schoolName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tên lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trường
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sĩ số
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((cls: any) => (
                <tr
                  key={cls.classId}
                  className="hover:bg-orange-50/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedClass(cls)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Lớp {cls.className}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cls.schoolName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cls.totalStudents} học sinh
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-orange-500 text-sm font-medium hover:underline flex items-center justify-end gap-1">
                      <ImageIcon size={16} /> Mở Album
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
