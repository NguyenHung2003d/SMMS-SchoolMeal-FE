import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAccountRequest, StaffDto } from "@/types/manager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { managerService } from "@/services/managerStaffService";
import { UpdateAccountRequest } from "@/types/auth";

interface StaffFormModalProps {
  staffToEdit?: StaffDto | null;
  onClose: () => void;
}

export default function StaffFormModal({
  staffToEdit,
  onClose,
}: StaffFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!staffToEdit;
  const [formData, setFormData] = useState<CreateAccountRequest>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        fullName: staffToEdit.fullName || "",
        email: staffToEdit.email || "",
        phone: staffToEdit.phoneNumber || "",
        role: staffToEdit.role || "",
        password: "",
      });
    }
  }, [staffToEdit]);

  const mutation = useMutation({
    mutationFn: (data: UpdateAccountRequest) => {
      if (isEditMode && staffToEdit) {
        return managerService.updateStaff(staffToEdit.userId, data);
      }
      return managerService.createStaff(data as any);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? "Cập nhật thành công!" : "Tạo tài khoản thành công!"
      );
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          (isEditMode ? "Cập nhật thất bại" : "Tạo tài khoản thất bại")
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {" "}
            {isEditMode ? "Cập nhật thông tin" : "Tạo tài khoản nhân viên"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                disabled={isEditMode}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò
              </label>
              <select
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="Teacher">Quản sinh / Giáo viên</option>
                <option value="KitchenStaff">Nhân viên bếp</option>
                <option value="Teacher">Giám thị</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                disabled={!isEditMode}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={mutation.isPending}
            >
              Hủy
            </button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử
                  lý...
                </>
              ) : isEditMode ? (
                "Cập nhật"
              ) : (
                "Tạo tài khoản"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
