import React from "react";
import { Mail, Phone, Lock, Unlock, Edit, Loader2, Trash2 } from "lucide-react";
import { StaffDto } from "@/types/manager";
import { getRoleInfo } from "@/helpers";

interface StaffTableProps {
  staffList: StaffDto[];
  isLoading: boolean;
  isError: boolean;
  onOpenStatusModal: (staff: StaffDto) => void;
  onEdit: (staff: StaffDto) => void;
  onDelete: (staff: StaffDto) => void;
}

export default function StaffTable({
  staffList,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onOpenStatusModal,
}: StaffTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
        <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500 bg-white rounded-lg shadow-sm border border-gray-100">
        Có lỗi xảy ra khi tải dữ liệu.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhân viên
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            ) : (
              staffList.map((staff) => {
                const roleInfo = getRoleInfo(staff.role);
                return (
                  <tr key={staff.userId} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-blue-600 font-bold">
                          {staff.avatarUrl ? (
                            <img
                              src={staff.avatarUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            staff.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">
                            {staff.fullName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400 mr-2" />
                          {staff.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400 mr-2" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.className}`}
                      >
                        {roleInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {staff.createdAt
                        ? new Date(staff.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {staff.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Vô hiệu hoá
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className={`p-1 rounded ${
                            staff.isActive
                              ? "text-red-500 hover:bg-red-50"
                              : "text-green-500 hover:bg-green-50"
                          }`}
                          onClick={() => onOpenStatusModal(staff)}
                          title={staff.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {staff.isActive ? (
                            <Lock size={18} />
                          ) : (
                            <Unlock size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => onEdit(staff)}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => onDelete(staff)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Xóa tài khoản"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
