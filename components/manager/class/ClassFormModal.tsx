import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react"; // Thêm Loader2
import { ClassDto, TeacherSimpleDto } from "@/types/manager-class";
import toast from "react-hot-toast";
import { AcademicYearDto } from "@/types/academic-year";

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

  // State quản lý việc đang submit
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      setIsSubmitting(true);
      await onSubmit(form);
    } catch (error) {
      // Xử lý lỗi nếu cần thiết, hoặc để hook cha xử lý
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* ... Các input fields giữ nguyên ... */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên lớp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:bg-gray-100"
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
                editingClass || isSubmitting
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
              value={form.yearId}
              onChange={(e) => setForm({ ...form, yearId: e.target.value })}
              disabled={!!editingClass || isSubmitting}
            >
              <option value="">-- Chọn niên khóa --</option>
              {academicYears.map((y) => (
                <option key={y.yearId} value={y.yearId}>
                  {y.yearName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Giáo viên chủ nhiệm
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all disabled:bg-gray-100"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium shadow-lg shadow-orange-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Đang lưu...
                </>
              ) : editingClass ? (
                "Lưu thay đổi"
              ) : (
                "Tạo lớp ngay"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
