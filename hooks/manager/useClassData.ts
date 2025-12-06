"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { managerClassService } from "@/services/manager/managerClass.service";
import {
  ClassDto,
  TeacherSimpleDto,
} from "@/types/manager-class";
import { AcademicYearDto } from "@/types/academic-year";

export const useClassData = () => {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherSimpleDto[]>([]);
  const [freeTeachers, setFreeTeachers] = useState<TeacherSimpleDto[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = async () => {
    setIsRefreshing(true);
    const toastId = toast.loading("Đang cập nhật dữ liệu...");
    try {
      await fetchData(false);
      toast.success("Dữ liệu đã được làm mới", { id: toastId });
    } catch (error) {
      toast.error("Lỗi khi làm mới", { id: toastId });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    classes,
    teachers,
    freeTeachers,
    academicYears,
    loading,
    isRefreshing,
    refreshData,
    fetchData, // Export để gọi lại sau khi Create/Update/Delete
  };
};
