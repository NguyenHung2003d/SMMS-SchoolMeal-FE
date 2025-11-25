"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  X,
  Loader2,
  School,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { managerClassService } from "@/services/managerClassService";
import { ClassDto, TeacherSimpleDto } from "@/types/manager-class";

export default function ManagerClasses() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherSimpleDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);

  const [classForm, setClassForm] = useState({
    className: "",
    yearId: "",
    teacherId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const classRes = await managerClassService.getAll();
      if (classRes && Array.isArray(classRes.data)) {
        setClasses(classRes.data);
      } else if (Array.isArray(classRes)) {
        setClasses(classRes);
      }

      const teacherRes = await managerClassService.getTeacherStatus();
      if (teacherRes) {
        const allTeachers = [
          ...(teacherRes.teachersWithoutClass || []),
          ...(teacherRes.teachersWithClass || []),
        ];
        const uniqueTeachers = allTeachers.filter(
          (v, i, a) => a.findIndex((t) => t.teacherId === v.teacherId) === i
        );
        setTeachers(uniqueTeachers);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu lớp học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setClassForm({ className: "", yearId: "", teacherId: "" });
    setEditingClass(null);
  };

  const openEditClassModal = (cls: ClassDto) => {
    setEditingClass(cls);
    setClassForm({
      className: cls.className,
      yearId: cls.yearId.toString(),
      teacherId: cls.teacherId ? cls.teacherId.toString() : "",
    });
    setShowEditClassModal(true);
  };

  const handleAddClass = async () => {
    if (!classForm.className || !classForm.yearId) {
      toast.error("Vui lòng nhập tên lớp và khối");
      return;
    }

    try {
      const payload = {
        className: classForm.className,
        yearId: parseInt(classForm.yearId),
        teacherId: classForm.teacherId ? parseInt(classForm.teacherId) : null,
      };

      await managerClassService.create(payload);

      toast.success("Tạo lớp thành công");
      setShowAddClassModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Tạo lớp thất bại (Lỗi Server)";
      toast.error(msg);
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;
    if (!classForm.className) {
      toast.error("Tên lớp không được để trống");
      return;
    }

    try {
      // Backend Handler UpdateClassCommand KHÔNG cập nhật YearId, nên ta bỏ qua nó
      const payload = {
        className: classForm.className,
        teacherId: classForm.teacherId ? parseInt(classForm.teacherId) : null,
        isActive: true, // Mặc định giữ active
      };

      await managerClassService.update(editingClass.classId, payload);

      toast.success("Cập nhật lớp thành công");
      setShowEditClassModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Cập nhật thất bại";
      toast.error(msg);
    }
  };

  // 🔴 DELETE
  const handleDeleteClass = async (id: string) => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa lớp học này? Dữ liệu liên quan có thể bị ảnh hưởng."
      )
    )
      return;
    try {
      await managerClassService.delete(id);
      toast.success("Xóa lớp thành công");
      fetchData();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  // ---FILTER LOGIC ---
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.className
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" || cls.yearId === parseInt(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <School className="h-8 w-8 text-orange-600" /> Quản lý lớp học
          </h1>
          <p className="text-gray-600 mt-1">
            Danh sách các lớp học và phân công giáo viên chủ nhiệm
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddClassModal(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center shadow-md transition-all"
        >
          <Plus size={18} className="mr-2" />
          Tạo lớp mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
          <div className="md:w-48">
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="all">Tất cả khối</option>
              {[1, 2, 3, 4, 5].map((g) => (
                <option key={g} value={g}>
                  Khối {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-orange-500 h-10 w-10" />
        </div>
      ) : (
        <>
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Không tìm thấy lớp học nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredClasses.map((cls) => (
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
                        Khối {cls.yearId}
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
                          Tạo ngày:{" "}
                          {new Date(cls.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex gap-2">
                      <button
                        onClick={() => openEditClassModal(cls)}
                        className="flex-1 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <Edit size={14} className="mr-1" /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.classId)}
                        className="flex-1 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <Trash size={14} className="mr-1" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {(showAddClassModal || showEditClassModal) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingClass ? "Cập nhật thông tin" : "Tạo lớp học mới"}
              </h2>
              <button
                onClick={() => {
                  setShowAddClassModal(false);
                  setShowEditClassModal(false);
                  resetForm();
                }}
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
                  value={classForm.className}
                  onChange={(e) =>
                    setClassForm({ ...classForm, className: e.target.value })
                  }
                  placeholder="Ví dụ: 1A, 2B..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Khối (Năm học) <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all ${
                    editingClass
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  value={classForm.yearId}
                  onChange={(e) =>
                    setClassForm({ ...classForm, yearId: e.target.value })
                  }
                  disabled={!!editingClass}
                >
                  <option value="">-- Chọn khối --</option>
                  {[1, 2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>
                      Khối {g}
                    </option>
                  ))}
                </select>
                {editingClass && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center">
                    * Không thể thay đổi khối khi đang cập nhật.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Giáo viên chủ nhiệm
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all"
                  value={classForm.teacherId}
                  onChange={(e) =>
                    setClassForm({ ...classForm, teacherId: e.target.value })
                  }
                >
                  <option value="">-- Chưa phân công --</option>
                  {teachers.map((t) => (
                    <option key={t.teacherId} value={t.teacherId}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Danh sách bao gồm các giáo viên trong trường.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddClassModal(false);
                    setShowEditClassModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={editingClass ? handleUpdateClass : handleAddClass}
                  className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium shadow-lg shadow-orange-200 transition-all"
                >
                  {editingClass ? "Lưu thay đổi" : "Tạo lớp ngay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
