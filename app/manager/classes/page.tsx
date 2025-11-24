"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Users,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { ClassDto, TeacherDto } from "@/types/manager-class";
import { managerClassService } from "@/services/managerClassService";
import toast from "react-hot-toast";

export default function ManagerClasses() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);

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
      }
      const teacherRes = await managerClassService.getTeacherStatus();
      if (teacherRes) {
        const allTeachers = [
          ...(teacherRes.teachersWithoutClass || []),
          ...(teacherRes.teachersWithClass || []),
        ];
        setTeachers(allTeachers);
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

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.className
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" || cls.yearId === parseInt(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  const resetForm = () => {
    setClassForm({ className: "", yearId: "", teacherId: "" });
    setEditingClass(null);
  };

  const handleAddClass = async () => {
    if (!classForm.className || !classForm.yearId) {
      toast.error("Vui lòng nhập tên lớp và khối");
      return;
    }

    try {
      await managerClassService.create({
        className: classForm.className,
        yearId: parseInt(classForm.yearId),
        teacherId: classForm.teacherId || undefined,
      });
      toast.success("Tạo lớp thành công");
      setShowAddClassModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Tạo lớp thất bại";
      toast.error(msg);
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;
    if (!classForm.className || !classForm.yearId) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await managerClassService.update(editingClass.classId, {
        className: classForm.className,
        teacherId: classForm.teacherId || undefined,
      });
      toast.success("Cập nhật lớp thành công");
      setShowEditClassModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lớp học này?")) return;
    try {
      await managerClassService.delete(id);
      toast.success("Xóa lớp thành công");
      fetchData();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const openEditClassModal = (cls: ClassDto) => {
    setEditingClass(cls);
    setClassForm({
      className: cls.className,
      yearId: cls.yearId.toString(),
      teacherId: cls.teacherId || "",
    });
    setShowEditClassModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý lớp học</h1>
          <p className="text-gray-600">Tạo và quản lý lớp học, học sinh</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddClassModal(true);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Tạo lớp
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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

      {loading && classes.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => {
              resetForm();
              setShowAddClassModal(true);
            }}
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-64 hover:border-orange-400 transition-colors cursor-pointer"
          >
            <div className="bg-blue-100 rounded-full p-4 mb-3">
              <Plus size={24} className="text-orange-500" />
            </div>
            <p className="font-medium text-gray-800">Tạo lớp học mới</p>
          </div>

          {filteredClasses.map((cls) => (
            <div
              key={cls.classId}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Lớp {cls.className}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <span className="text-gray-400">GVCN:</span>
                      <span className="font-medium">
                        {cls.teacherName || "Chưa phân công"}
                      </span>
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Khối {cls.yearId}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Sĩ số
                  </p>
                  <p className="font-bold text-lg text-gray-800">--</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openEditClassModal(cls)}
                    className="flex-1 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center justify-center text-sm font-medium transition-colors"
                  >
                    <Edit size={16} className="mr-1" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.classId)}
                    className="flex-1 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center justify-center text-sm font-medium transition-colors"
                  >
                    <Trash size={16} className="mr-1" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAddClassModal || showEditClassModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingClass ? "Cập nhật lớp học" : "Tạo lớp học mới"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddClassModal(false);
                    setShowEditClassModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lớp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={classForm.className}
                    onChange={(e) =>
                      setClassForm({ ...classForm, className: e.target.value })
                    }
                    placeholder="Ví dụ: 1A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khối (Năm học) <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={classForm.yearId}
                    onChange={(e) =>
                      setClassForm({ ...classForm, yearId: e.target.value })
                    }
                    // Backend Update không cho sửa khối, nên disable khi edit
                    disabled={!!editingClass}
                  >
                    <option value="">Chọn khối</option>
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g}>
                        Khối {g}
                      </option>
                    ))}
                  </select>
                  {editingClass && (
                    <p className="text-xs text-gray-500 mt-1">
                      Không thể thay đổi khối khi cập nhật.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giáo viên chủ nhiệm
                  </label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                </div>

                <div className="flex gap-3 pt-4 mt-2">
                  <button
                    onClick={() => {
                      setShowAddClassModal(false);
                      setShowEditClassModal(false);
                      resetForm();
                    }}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={editingClass ? handleUpdateClass : handleAddClass}
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    {editingClass ? "Lưu thay đổi" : "Tạo lớp"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
