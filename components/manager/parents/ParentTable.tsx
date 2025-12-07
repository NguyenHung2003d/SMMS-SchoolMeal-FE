"use client";
import React from "react";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Loader2,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ParentAccountDto } from "@/types/manager-parent";

interface ParentTableProps {
  data: ParentAccountDto[];
  loading: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, currentStatus: boolean) => void;
  onEdit: (parent: ParentAccountDto) => void;
}

export function ParentTable({
  data,
  loading,
  onDelete,
  onStatusChange,
  onEdit,
}: ParentTableProps) {
  
  const renderPaymentStatus = (parent: ParentAccountDto) => {
    const status = parent.paymentStatus;

    switch (status) {
      case "Đã thanh toán":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {status}
          </span>
        );
      
      case "Chưa thanh toán":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-red-700 bg-red-50 border border-red-100">
            <AlertCircle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
      
      case "Chưa tạo hóa đơn":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200">
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            {status || "Chưa xác định"}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Phụ huynh & Quan hệ
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Liên hệ</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Học sinh (Con)
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Lớp học</th>

              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Thanh toán
              </th>

              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Trạng thái TK
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mb-2 text-gray-400" />
                    <span className="text-gray-500">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Không tìm thấy phụ huynh nào.
                </td>
              </tr>
            ) : (
              data.map((parent) => (
                <tr
                  key={parent.userId}
                  className="hover:bg-gray-50 transition-colors border-none"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900">
                        {parent.fullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {parent.relationName || "Phụ huynh"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex flex-col gap-0.5">
                      <span>{parent.email}</span>
                      <span className="text-xs text-gray-500">
                        {parent.phone}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {parent.children && parent.children.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {parent.children.map((child, idx) => (
                          <div key={idx} className="text-gray-700">
                            <span>
                              {child.gender === "M" ? "👦" : "👧"}{" "}
                              {child.fullName}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        Chưa liên kết
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {parent.children && parent.children.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {Array.from(
                          new Set(
                            parent.children
                              .map((c) => c.className)
                              .filter(Boolean)
                          )
                        ).map((clsName, idx) => (
                          <span key={idx} className="text-xs text-gray-700">
                            {clsName}
                          </span>
                        ))}
                        {parent.children.every((c) => !c.className) && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {renderPaymentStatus(parent)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                        parent.isActive
                          ? "text-green-700 bg-green-50"
                          : "text-red-700 bg-red-50"
                      }`}
                    >
                      {parent.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => onEdit(parent)}>
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(parent.userId, parent.isActive)
                          }
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          {parent.isActive
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onDelete(parent.userId)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Xóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}