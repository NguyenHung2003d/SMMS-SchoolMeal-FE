"use client";
import React, { useState } from "react";
import { X, Save, Loader2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { paymentSettingsService } from "@/services/manager/managerPayment.service";

interface PayOsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayOsConfigModal = ({
  isOpen,
  onClose,
}: PayOsConfigModalProps) => {
  const [formData, setFormData] = useState({
    clientId: "",
    apiKey: "",
    checksumKey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.apiKey || !formData.checksumKey) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);
    try {
      await paymentSettingsService.connectPayOs(formData);
      toast.success("Cấu hình PayOS thành công!");
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Lỗi khi lưu cấu hình PayOS";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard size={24} /> Cấu hình PayOS
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
            Lấy các thông tin này tại trang quản trị của{" "}
            <a
              href="https://payos.vn"
              target="_blank"
              className="underline font-bold"
            >
              PayOS
            </a>{" "}
            (Menu: Tích hợp).
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID (Mã khách hàng) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              placeholder="Ví dụ: 8d2a..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Ví dụ: 20d6..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Checksum Key <span className="text-red-500">*</span>
            </label>
            <input
              type="password" // Để password cho bảo mật, hoặc text nếu muốn nhìn thấy
              name="checksumKey"
              value={formData.checksumKey}
              onChange={handleChange}
              placeholder="Nhập Checksum Key..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" /> Đang
                  lưu...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Lưu kết nối
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
