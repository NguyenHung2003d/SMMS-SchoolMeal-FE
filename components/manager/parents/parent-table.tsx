"use client";
import React from "react";
import { MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react";
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
}

export function ParentTable({ data, loading, onDelete, onStatusChange }: ParentTableProps) {
    return (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="px-4 py-3">Phụ huynh</th>
                            <th className="px-4 py-3">Liên hệ</th>
                            <th className="px-4 py-3">Học sinh (Con)</th>
                            <th className="px-4 py-3">Lớp (Đại diện)</th>
                            <th className="px-4 py-3 text-center">Trạng thái</th>
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                                    Đang tải dữ liệu...
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
                                <tr key={parent.userId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {parent.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        <div className="flex flex-col">
                                            <span>{parent.email}</span>
                                            <span className="text-xs text-gray-400">{parent.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {parent.childrenNames?.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {parent.childrenNames.map((child, idx) => (
                                                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                                        {child}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Chưa có liên kết</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {parent.className || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${parent.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {parent.isActive ? "Hoạt động" : "Bị khóa"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => onStatusChange(parent.userId, parent.isActive)}
                                                >
                                                    {parent.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert("Tính năng đang phát triển")}>
                                                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
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