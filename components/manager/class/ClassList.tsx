import React from "react";
import { Edit, Trash, User, Calendar, Loader2 } from "lucide-react";
import { ClassDto, AcademicYearDto } from "@/types/manager-class";

interface ClassListProps {
  loading: boolean;
  classes: ClassDto[];
  academicYears: AcademicYearDto[];
  onEdit: (cls: ClassDto) => void;
  onDelete: (cls: ClassDto) => void;
}

export default function ClassList({
  loading,
  classes,
  academicYears,
  onEdit,
  onDelete,
}: ClassListProps) {
  const getYearName = (id: number) => {
    const found = academicYears.find((y) => y.yearId === id);
    return found ? found.yearName : `Mã khóa: ${id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-500 h-10 w-10" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">Không tìm thấy lớp học nào.</p>
        {academicYears.length === 0 && (
          <p className="text-sm text-red-400 mt-2">
            Hệ thống chưa có Niên khóa nào. Vui lòng thêm niên khóa trước.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {classes.map((cls) => (
        <div
          key={cls.classId}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xl">
                {cls.className.substring(0, 2)}
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                {getYearName(cls.yearId)}
              </span>
            </div>

            <h3 className="font-bold text-xl text-gray-800 mb-2">
              Lớp {cls.className}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User size={16} className="mr-2 text-gray-400" />
                <span className="truncate">
                  {cls.teacherName || "Chưa gán GV"}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <span>
                  {new Date(cls.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex gap-2">
              <button
                onClick={() => onEdit(cls)}
                className="flex-1 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Edit size={14} className="mr-1" /> Sửa
              </button>
              <button
                onClick={() => onDelete(cls)}
                className="flex-1 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Trash size={14} className="mr-1" /> Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
