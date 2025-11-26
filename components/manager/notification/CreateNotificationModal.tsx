"use client";
import React from "react";
import { X, Send, Users, User, ChefHat, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateNotificationRequest } from "@/types/notification";

export default function CreateNotificationModal({
  open,
  formData,
  setFormData,
  onSubmit,
  onClose,
}: {
  open: boolean;
  formData: CreateNotificationRequest;
  setFormData: any;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const recipientGroups = [
    { key: "sendToParents", label: "Phụ huynh", icon: User },
    { key: "sendToTeachers", label: "Giáo viên", icon: GraduationCap },
    { key: "sendToKitchenStaff", label: "Nhân viên bếp", icon: ChefHat },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Soạn thông báo mới
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Gửi thông báo đến các thành viên trong trường
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all border border-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div id="create-notif-form" className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full border-2 border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                placeholder="Ví dụ: Thông báo nghỉ lễ 30/4..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Gửi đến <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recipientGroups.map((item) => {
                  const Icon = item.icon;
                  const isChecked = (formData as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          [item.key]: !isChecked,
                        })
                      }
                      className={`
                        cursor-pointer relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200
                        ${
                          isChecked
                            ? "border-orange-500 bg-blue-50 shadow-md shadow-blue-200/50"
                            : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
                        ${
                          isChecked
                            ? "bg-orange-500 border-orange-500"
                            : "bg-white border-gray-400"
                        }
                      `}
                      >
                        {isChecked && (
                          <div className="w-2.5 h-2.5 bg-white rounded" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          size={18}
                          className={
                            isChecked ? "text-orange-600" : "text-gray-500"
                          }
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isChecked ? "text-orange-700" : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Nội dung chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                className="w-full border-2 border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md"
                placeholder="Nhập nội dung thông báo..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Hình thức gửi
                </label>
                <select
                  className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-semibold cursor-pointer transition-all hover:shadow-md"
                  value={formData.sendType}
                  onChange={(e) =>
                    setFormData({ ...formData, sendType: e.target.value })
                  }
                >
                  <option value="Immediate">🚀 Gửi ngay lập tức</option>
                  <option value="Scheduled">📅 Lên lịch gửi (Cron)</option>
                </select>
              </div>

              {formData.sendType === "Scheduled" && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Cron Expression
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm font-semibold bg-white transition-all hover:shadow-md"
                    placeholder="0 8 * * *"
                    value={formData.scheduleCron || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduleCron: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    Ví dụ: <code className="bg-white px-2 py-1 rounded border border-gray-200">0 8 * * *</code> (8h00 sáng hàng ngày)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 font-semibold transition-all hover:shadow-md active:scale-95"
          >
            Hủy bỏ
          </button>
          <Button
            onClick={onSubmit}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={18} /> Gửi thông báo
          </Button>
        </div>
      </div>
    </div>
  );
}