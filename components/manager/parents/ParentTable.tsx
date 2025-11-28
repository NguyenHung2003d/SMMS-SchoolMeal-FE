"use client";
import React from "react";
import { MoreHorizontal, Edit, Trash, Loader2, UserCircle } from "lucide-react";
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
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="px-4 py-3">Phụ huynh & Quan hệ</th>
              <th className="px-4 py-3">Liên hệ</th>
              <th className="px-4 py-3">Học sinh (Con)</th>
              <th className="px-4 py-3">Lớp học</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 mb-2 text-blue-600" />
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Không tìm thấy phụ huynh nào.
                </td>
              </tr>
            ) : (
              data.map((parent) => (
                <tr
                  key={parent.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-base">
                        {parent.fullName}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <UserCircle size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {parent.relationName || "Phụ huynh"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-900">{parent.email}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {parent.phone}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {parent.children && parent.children.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {parent.children.map((child, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                             <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">
                              {child.gender === 'M' ? '👦' : '👧'} {child.fullName}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Chưa liên kết học sinh
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {parent.children && parent.children.length > 0 ? (
                       <div className="flex flex-col gap-1">
                          {Array.from(new Set(parent.children.map(c => c.className).filter(Boolean))).map((clsName, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 border px-2 py-0.5 rounded text-gray-700 w-fit">
                                  {clsName}
                              </span>
                          ))}
                          {parent.children.every(c => !c.className) && "-"}
                       </div>
                    ) : (
                        "-"
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        parent.isActive
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {parent.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-200">
                          <MoreHorizontal className="h-4 w-4" />
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