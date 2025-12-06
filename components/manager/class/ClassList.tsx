import React, { useMemo, useState } from "react";
import { Edit, Trash, User, Calendar, Loader2, Check, Copy } from "lucide-react";
import { ClassDto } from "@/types/manager-class";
import { AcademicYearDto } from "@/types/academic-year";

interface ClassListProps {
  loading: boolean;
  classes: ClassDto[];
  academicYears: AcademicYearDto[];
  onEdit: (cls: ClassDto) => void;
  onDelete: (cls: ClassDto) => void;
}

const CopyableId = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      title="Bấm để copy ID lớp học"
      className="inline-flex items-center gap-2 px-2 py-1 mt-1 mb-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-gray-500 transition-all group/id"
    >
      <span className="font-mono font-medium select-none">ID:</span>
      <span className="font-mono max-w-[100px] truncate">{id}</span>
      {copied ? (
        <Check className="text-green-500" size={12} />
      ) : (
        <Copy size={12} className="opacity-50 group-hover/id:opacity-100" />
      )}
    </div>
  );
};

const ClassList = React.memo(function ClassList({
  loading,
  classes,
  academicYears,
  onEdit,
  onDelete,
}: ClassListProps) {
  
  const yearMap = useMemo(() => {
    const map: Record<number, string> = {};
    academicYears.forEach((y) => {
      map[y.yearId] = y.yearName;
    });
    return map;
  }, [academicYears]);

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
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col"
        >
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xl select-none">
                {cls.className.substring(0, 2)}
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                {yearMap[cls.yearId] || `Mã khóa: ${cls.yearId}`}
              </span>
            </div>

            <h3 className="font-bold text-xl text-gray-800 mb-2">
              Lớp {cls.className}
            </h3>

            <div>
              <CopyableId id={cls.classId} />
            </div>

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
          </div>
          
          <div className="p-4 border-t border-gray-50 flex gap-2 bg-gray-50/30">
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
      ))}
    </div>
  );
});

export default ClassList;