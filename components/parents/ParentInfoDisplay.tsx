  "use client";

  import React from "react";
  import { Calendar, Edit, Mail, Phone, User } from "lucide-react";
  import { ParentAccountDto } from "@/types/parent";

  type ParentInfoDisplayProps = {
    parentInfo: ParentAccountDto;
    onEditClick: () => void;
  };

  export function ParentInfoDisplay({
    parentInfo,
    onEditClick,
  }: ParentInfoDisplayProps) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-2xl shadow-md p-8 border border-blue-100">
        {/* Header */}
        <div className="flex justify-between items-center pb-8 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h2>
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
          >
            <Edit size={18} />
            Chỉnh sửa
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden shadow-lg border-4 border-white">
            <img
              src={parentInfo.avatarUrl || "https://i.imgur.com/3bLRsZQ.jpg"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Họ và tên
            </label>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <User className="text-blue-500 flex-shrink-0" size={20} />
              <span className="font-medium text-slate-800">
                {parentInfo.fullName}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Email
            </label>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <Mail className="text-blue-500 flex-shrink-0" size={20} />
              <span className="font-medium text-slate-800">
                {parentInfo.email}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Số điện thoại
            </label>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <Phone className="text-blue-500 flex-shrink-0" size={20} />
              <span className="font-medium text-slate-800">
                {parentInfo.phone || "Chưa cập nhật"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Ngày sinh
            </label>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <Calendar className="text-blue-500 flex-shrink-0" size={20} />
              <span className="font-medium text-slate-800">
                {parentInfo.dateOfBirth || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
