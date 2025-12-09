"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  Save,
  Calendar,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { UpdatedParentInfoFormProps } from "@/types/parent";
import { toast } from "react-hot-toast";

export function ParentInfoForm({
  parentInfo,
  isSaving,
  onInfoChange,
  onSubmit,
  onAvatarChange,
  onCancel,
}: UpdatedParentInfoFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB.");
        return;
      }
      onAvatarChange(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Chỉnh sửa thông tin
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center space-y-4 md:w-1/3">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-gray-100 relative">
                <img
                  src={
                    previewUrl ||
                    parentInfo.avatarUrl ||
                    "https://ui-avatars.com/api/?name=" + parentInfo.fullName
                  }
                  alt="avatar"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                <UploadCloud size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Nhấn vào ảnh để thay đổi
              <br />
              (Tối đa 5MB)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 space-y-5">
            <InputField
              icon={<User size={18} />}
              label="Họ và tên"
              name="fullName"
              value={parentInfo.fullName || ""}
              onChange={onInfoChange}
              placeholder="Nhập họ và tên đầy đủ"
            />

            <InputField
              icon={<Mail size={18} />}
              label="Email"
              type="email"
              name="email"
              value={parentInfo.email || ""}
              onChange={onInfoChange}
              placeholder="example@email.com"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                icon={<Phone size={18} />}
                label="Số điện thoại"
                name="phone"
                value={parentInfo.phone || ""}
                onChange={onInfoChange}
                placeholder="0912..."
              />
              <InputField
                icon={<Calendar size={18} />}
                label="Ngày sinh"
                type="date"
                name="dateOfBirth"
                value={
                  parentInfo.dateOfBirth
                    ? parentInfo.dateOfBirth.split("T")[0]
                    : ""
                }
                onChange={onInfoChange}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

const InputField = ({ label, icon, className, ...props }: any) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 placeholder:text-gray-400"
      />
    </div>
  </div>
);
