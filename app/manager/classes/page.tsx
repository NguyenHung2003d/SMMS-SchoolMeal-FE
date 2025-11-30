"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { managerClassService } from "@/services/managerClass.service";
import {
  AcademicYearDto,
  ClassDto,
  TeacherSimpleDto,
} from "@/types/manager-class";
import { authService } from "@/services/auth.service";
import ClassToolbar from "@/components/manager/class/ClassToolbar";
import ClassList from "@/components/manager/class/ClassList";
import ClassFormModal from "@/components/manager/class/ClassFormModal";
import DeleteClassModal from "@/components/manager/class/DeleteClassModal";

export default function ManagerClasses() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherSimpleDto[]>([]);
  const [freeTeachers, setFreeTeachers] = useState<TeacherSimpleDto[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // ✅ State loading cho nút refresh

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassDto | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [yearsData, classRes, teacherRes] = await Promise.all([
        managerClassService.getAcademicYears().catch((err) => {
          console.error("Lỗi lấy niên khóa:", err);
          return [];
        }),
        managerClassService.getAll(),
        managerClassService.getTeacherStatus().catch(() => null),
      ]);

      setAcademicYears(yearsData);

      if (classRes && Array.isArray(classRes.data)) {
        setClasses(classRes.data);
      } else if (Array.isArray(classRes)) {
        setClasses(classRes);
      }

      if (teacherRes) {
        setFreeTeachers(teacherRes.teachersWithoutClass || []);
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
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true); // Hiện skeleton loading ở bảng
    const toastId = toast.loading("Đang cập nhật dữ liệu...");

    try {
      await fetchData();
      toast.success("Dữ liệu đã được làm mới", { id: toastId });
    } catch (error) {
      toast.error("Lỗi khi làm mới", { id: toastId });
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingClass(null);
    setShowFormModal(true);
  };

  const openEditModal = (cls: ClassDto) => {
    setEditingClass(cls);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData: {
    className: string;
    yearId: string;
    teacherId: string;
  }) => {
    if (editingClass) {
      try {
        const payload = {
          className: formData.className,
          teacherId: formData.teacherId ? formData.teacherId : null,
          isActive: true,
        };
        await managerClassService.update(editingClass.classId, payload);
        toast.success("Cập nhật lớp thành công");
        setShowFormModal(false);
        fetchData();
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        if (serverMessage) {
          toast.error(serverMessage);
        } else {
          toast.error("Cập nhật thất bại");
        }
      }
    } else {
      const currentUserRaw = authService.getCurrentUser();
      const currentUser =
        currentUserRaw instanceof Promise
          ? await currentUserRaw
          : currentUserRaw;

      if (!currentUser || !currentUser.schoolId) {
        toast.error("Lỗi: Không tìm thấy thông tin trường học.");
        return;
      }

      try {
        const payload = {
          className: formData.className,
          yearId: parseInt(formData.yearId),
          teacherId: formData.teacherId ? formData.teacherId : null,
          schoolId: currentUser.schoolId,
        };
        await managerClassService.create(payload);
        toast.success("Tạo lớp thành công");
        setShowFormModal(false);
        fetchData();
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        if (serverMessage) {
          toast.error(serverMessage);
        } else {
          toast.error("Tạo lớp thất bại (Vui lòng thử lại)");
        }
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;
    try {
      await managerClassService.delete(classToDelete.classId);
      toast.success("Xóa lớp thành công");
      fetchData();
    } catch (error) {
      toast.error("Xóa thất bại");
    } finally {
      setClassToDelete(null);
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.className
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "all" || cls.yearId === parseInt(selectedYear);
    return matchesSearch && matchesYear;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ClassToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        academicYears={academicYears}
        onAddClick={openAddModal}
        handleRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        loading={loading}
      />

      <ClassList
        loading={loading}
        classes={filteredClasses}
        academicYears={academicYears}
        onEdit={openEditModal}
        onDelete={(cls) => setClassToDelete(cls)}
      />

      {showFormModal && (
        <ClassFormModal
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          editingClass={editingClass}
          academicYears={academicYears}
          teachers={teachers}
          freeTeachers={freeTeachers}
        />
      )}

      {/* Delete Modal */}
      <DeleteClassModal
        classData={classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
