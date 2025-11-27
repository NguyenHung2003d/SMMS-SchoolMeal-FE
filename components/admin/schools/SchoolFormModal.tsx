"use client";
import {
  CreateSchoolDto,
  SchoolDTO,
  UpdateSchoolDto,
} from "@/types/admin-school";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSchoolDto | UpdateSchoolDto) => Promise<void>;
  initialData?: SchoolDTO | null;
  isSubmitting: boolean;
}

export default function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: SchoolFormModalProps) {
  const [formData, setFormData] = useState<CreateSchoolDto>({
    schoolName: "",
    contactEmail: "",
    hotline: "",
    schoolAddress: "",
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        schoolName: initialData.schoolName,
        contactEmail: initialData.contactEmail || "",
        hotline: initialData.hotline || "",
        schoolAddress: initialData.schoolAddress || "",
        isActive: initialData.isActive,
      });
    } else {
      setFormData({
        schoolName: "",
        contactEmail: "",
        hotline: "",
        schoolAddress: "",
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Cập nhật thông tin trường" : "Thêm trường học mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên trường <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.schoolName}
              onChange={(e) =>
                setFormData({ ...formData, schoolName: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Nhập tên trường học..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotline
              </label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) =>
                  setFormData({ ...formData, hotline: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0905..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.schoolAddress}
              onChange={(e) =>
                setFormData({ ...formData, schoolAddress: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Nhập địa chỉ..."
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm text-gray-700 font-medium select-none"
            >
              Kích hoạt hoạt động ngay
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Đang xử lý... 
                </>
              ) : initialData ? (
                "Lưu thay đổi"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
