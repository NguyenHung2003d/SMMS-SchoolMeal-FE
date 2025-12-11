"use client";
import { CreateNotificationDto } from "@/types/admin-notification";
import { Loader2, Send, Users, X, Link as LinkIcon } from "lucide-react"; // Thêm icon Link
import { useState } from "react";
import toast from "react-hot-toast";

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNotificationDto) => Promise<void>;
  isSubmitting: boolean;
}

export default function CreateNotificationModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateNotificationModalProps) {
  const initialFormData: CreateNotificationDto = {
    title: "",
    content: "",
    sendType: "Immediate", // Giá trị mặc định
    attachmentUrl: "",
  };
  const [formData, setFormData] =
    useState<CreateNotificationDto>(initialFormData);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10 shrink-0">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Send size={20} className="text-orange-500" />
            Gửi thông báo mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              placeholder="VD: Thông báo bảo trì hệ thống"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none"
              rows={6}
              placeholder="Nhập nội dung chi tiết..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại gửi
              </label>
              <select
                value={formData.sendType}
                onChange={(e) =>
                  setFormData({ ...formData, sendType: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 outline-none transition bg-white"
              >
                <option value="Immediate">Gửi ngay (Tức thời)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <LinkIcon size={14} /> Link đính kèm (Optional)
              </label>
              <input
                type="text"
                value={formData.attachmentUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, attachmentUrl: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 outline-none transition"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2 text-sm text-blue-700">
            <Users size={16} className="mt-0.5 shrink-0" />
            <p>
              Lưu ý: Thông báo này sẽ được gửi đến{" "}
              <strong>tất cả người dùng</strong> trong hệ thống và hiển thị ngay
              lập tức.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-70 shadow-orange-200 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Đang gửi...
              </>
            ) : (
              <>
                <Send size={18} /> Gửi thông báo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
