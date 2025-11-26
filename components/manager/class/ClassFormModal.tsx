import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  AcademicYearDto,
  ClassDto,
  TeacherSimpleDto,
} from "@/types/manager-class";
import toast from "react-hot-toast";

interface ClassFormModalProps {
  onClose: () => void;
  onSubmit: (formData: {
    className: string;
    yearId: string;
    teacherId: string;
  }) => Promise<void>;
  editingClass: ClassDto | null;
  academicYears: AcademicYearDto[];
  teachers: TeacherSimpleDto[];
  freeTeachers: TeacherSimpleDto[];
}

export default function ClassFormModal({
  onClose,
  onSubmit,
  editingClass,
  academicYears,
  teachers,
  freeTeachers,
}: ClassFormModalProps) {
  const [form, setForm] = useState({
    className: "",
    yearId: "",
    teacherId: "",
  });

  useEffect(() => {
    if (editingClass) {
      setForm({
        className: editingClass.className,
        yearId: editingClass.yearId.toString(),
        teacherId: editingClass.teacherId
          ? editingClass.teacherId.toString()
          : "",
      });
    } else {
      setForm({ className: "", yearId: "", teacherId: "" });
    }
  }, [editingClass]);

  const handleSubmit = async () => {
    if (!form.className || !form.yearId) {
      toast.error("Vui lòng nhập tên lớp và chọn niên khóa");
      return;
    }
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {editingClass ? "Cập nhật thông tin" : "Tạo lớp học mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên lớp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              placeholder="Ví dụ: 1A, 2B..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Niên khóa <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all ${
                editingClass
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
              value={form.yearId}
              onChange={(e) => setForm({ ...form, yearId: e.target.value })}
              disabled={!!editingClass}
            >
              <option value="">-- Chọn niên khóa --</option>
              {academicYears.map((y) => (
                <option key={y.yearId} value={y.yearId}>
                  {y.yearName}
                </option>
              ))}
            </select>
            {academicYears.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Chưa có dữ liệu niên khóa. Vui lòng liên hệ Admin.
              </p>
            )}
            {editingClass && (
              <p className="text-xs text-amber-600 mt-1">
                * Không thể thay đổi niên khóa khi đang cập nhật.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Giáo viên chủ nhiệm
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option value="">-- Chưa phân công --</option>
              {teachers.map((t) => {
                const isFree = freeTeachers.some(
                  (ft) => ft.teacherId === t.teacherId
                );
                const isCurrentTeacher =
                  editingClass &&
                  String(editingClass.teacherId) === String(t.teacherId);

                if (isFree || isCurrentTeacher) {
                  return (
                    <option key={t.teacherId} value={t.teacherId}>
                      {t.fullName}
                      {isCurrentTeacher ? " (Hiện tại)" : ""}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium shadow-lg shadow-orange-200 transition-all"
            >
              {editingClass ? "Lưu thay đổi" : "Tạo lớp ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
