"use client";

import React, { useState } from "react";
import { Edit, Mail, Phone, Calendar, User, ShieldCheck } from "lucide-react";
import { ParentInfoDisplayProps } from "@/types/parent";
import { getImageUrl } from "@/lib/utils";

export function ParentInfoDisplay({
  parentInfo,
  onEditClick,
}: ParentInfoDisplayProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
        <div className="absolute inset-0 bg-white/10 pattern-dots"></div>
      </div>

      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-12 mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-[6px] border-white bg-white shadow-lg overflow-hidden">
              {parentInfo.avatarUrl && !imageError ? (
                <img
                  src={getImageUrl(parentInfo.avatarUrl)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-300" />
                </div>
              )}
            </div>
            <div
              className="absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-4 border-white"
              title="Verified Parent"
            >
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>

          <button
            onClick={onEditClick}
            className="mb-2 flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            <Edit size={16} />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {parentInfo.fullName}
          </h2>
          <p className="text-gray-500 font-medium">Phụ huynh</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            icon={<Mail className="text-blue-600" size={20} />}
            label="Email"
            value={parentInfo.email}
          />
          <InfoCard
            icon={<Phone className="text-green-600" size={20} />}
            label="Số điện thoại"
            value={parentInfo.phone || "Chưa cập nhật"}
          />
          <InfoCard
            icon={<Calendar className="text-purple-600" size={20} />}
            label="Ngày sinh"
            value={
              parentInfo.dateOfBirth
                ? new Date(parentInfo.dateOfBirth).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"
            }
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors">
      <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="font-medium text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}
