import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAccountRequest, StaffDto } from "@/types/manager";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { managerService } from "@/services/manager/managerStaff.service";
import { UpdateAccountRequest } from "@/types/auth";

interface StaffFormModalProps {
  staffToEdit?: StaffDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StaffFormModal({
  staffToEdit,
  onClose,
  onSuccess,
}: StaffFormModalProps) {
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
        phone: staffToEdit.phone || "",
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
      onSuccess();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">
            {isEditMode ? "Cập nhật thông tin" : "Tạo tài khoản nhân viên"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              disabled={isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="">-- Chọn --</option>
                <option value="Teacher">Giáo viên</option>
                <option value="KitchenStaff">NV Bếp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu{" "}
              {isEditMode && (
                <span className="font-normal text-gray-400">
                  (Để trống nếu không đổi)
                </span>
              )}
            </label>
            <input
              type="password"
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={mutation.isPending}
            >
              Hủy
            </button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center"
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {mutation.isPending
                ? "Đang xử lý..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
