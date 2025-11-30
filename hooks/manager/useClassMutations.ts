"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { managerClassService } from "@/services/managerClass.service";
import { authService } from "@/services/auth.service";
import { ClassDto } from "@/types/manager-class";

interface UseClassMutationsProps {
  onSuccess: () => void;
}

export const useClassMutations = ({ onSuccess }: UseClassMutationsProps) => {
  const handleFormSubmit = async (
    formData: { className: string; yearId: string; teacherId: string },
    editingClass: ClassDto | null,
    closeModal: () => void
  ) => {
    if (editingClass) {
      // --- UPDATE ---
      try {
        const payload = {
          className: formData.className,
          teacherId: formData.teacherId ? formData.teacherId : null,
          isActive: true,
        };
        await managerClassService.update(editingClass.classId, payload);
        toast.success("Cập nhật lớp thành công");
        closeModal();
        onSuccess();
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        toast.error(serverMessage || "Cập nhật thất bại");
      }
    } else {
      // --- CREATE ---
      const currentUserRaw = authService.getCurrentUser();
      const currentUser = currentUserRaw instanceof Promise ? await currentUserRaw : currentUserRaw;

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
        closeModal();
        onSuccess();
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        toast.error(serverMessage || "Tạo lớp thất bại (Vui lòng thử lại)");
      }
    }
  };

  const handleDeleteClass = async (classId: string, closeDeleteModal: () => void) => {
    try {
      await managerClassService.delete(classId);
      toast.success("Xóa lớp thành công");
      closeDeleteModal();
      onSuccess();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  return {
    handleFormSubmit,
    handleDeleteClass,
  };
};