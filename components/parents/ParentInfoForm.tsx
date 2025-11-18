"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { Camera, User, Mail, Phone, Save, Calendar, X } from "lucide-react";
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

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg p-8">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileChange}
      />

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="flex flex-col items-center pb-8 border-b border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Thông tin cá nhân
          </h2>
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden shadow-xl transition-transform group-hover:scale-105">
              <img
                src={
                  previewUrl ||
                  parentInfo.avatarUrl ||
                  "https://i.imgur.com/3bLRsZQ.jpg"
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleCameraClick}
              className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            >
              <Camera size={20} />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-4 font-medium">
            Nhấn để thay đổi ảnh đại diện
          </p>
        </div>

        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Họ và tên
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                name="fullName"
                value={parentInfo.fullName || ""}
                onChange={onInfoChange}
                className="pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                type="email"
                name="email"
                onChange={onInfoChange}
                value={parentInfo.email || ""}
                className="pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                placeholder="Nhập email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                name="phone"
                value={parentInfo.phone || ""}
                onChange={onInfoChange}
                className="pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Ngày sinh
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                type="date"
                name="dateOfBirth"
                value={parentInfo.dateOfBirth || ""}
                onChange={onInfoChange}
                className="pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <X size={20} />
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <>
                <Save size={20} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={20} />
                Lưu thông tin
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
