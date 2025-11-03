"use client";
import React, { useState, useMemo } from "react";
import { Info, Search, Filter, Edit, Trash, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { classes, parents, students } from "@/data";
import Link from "next/link";

export default function ManagerParentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý tài khoản phụ huynh
          </h1>
          <p className="text-gray-600">
            Tạo và quản lý tài khoản phụ huynh toàn trường
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center"
        >
          <UserPlus size={16} className="mr-2" />
          Tạo tài khoản phụ huynh
        </Button>
      </div>
      {/* Tạo tài khoản theo lớp */}
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Tạo tài khoản theo lớp</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Lớp</th>
              <th className="px-4 py-2 text-left">
                Phụ huynh chưa có tài khoản
              </th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem: any) => {
              const pending = students.filter(
                (s: any) => s.class === classItem.name && !s.parent.hasAccount
              ).length;
              return (
                <tr key={classItem.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">
                    Lớp {classItem.name}
                  </td>
                  <td className="px-4 py-2">
                    {pending > 0 ? (
                      <span className="text-red-600 font-semibold">
                        {pending} phụ huynh chưa có
                      </span>
                    ) : (
                      <span className="text-green-600">Tất cả đã có</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Link
                      href={`/manager/parents/class/${classItem.id}?tab=excel`}
                    >
                      Nhập Excel
                    </Link>
                    <Link href={`/manager/parents/class/${classItem.id}`}>
                      Quản lý lớp
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Banner */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
        <Info size={20} className="text-blue-500 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-800 mb-1">
            Về tài khoản phụ huynh
          </h3>
          <p className="text-sm text-blue-700">
            Tài khoản này cho phép phụ huynh theo dõi thông tin học tập, thực
            đơn và hoạt động của học sinh.
          </p>
        </div>
      </div>
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="p-0">
          <CreateParentModal onClose={() => setShowCreateModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
function CreateParentModal({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const availableStudents = useMemo(
    () => students.filter((s: any) => !s.parent?.hasAccount),
    []
  );

  const addStudent = (stu: any) => {
    if (!selectedStudents.some((x) => x.id === stu.id))
      setSelectedStudents([...selectedStudents, stu]);
  };

  const removeStudent = (id: number) =>
    setSelectedStudents(selectedStudents.filter((s) => s.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tạo tài khoản cho: ${fullName}`);
    onClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Tạo tài khoản phụ huynh</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <div>
          <p className="text-sm font-medium mb-1">Chọn học sinh liên kết</p>
          <div className="max-h-32 overflow-y-auto border rounded p-2">
            {availableStudents.map((s: any) => (
              <div
                key={s.id}
                className="flex justify-between items-center p-1 hover:bg-gray-50 cursor-pointer"
                onClick={() => addStudent(s)}
              >
                <span>
                  {s.name} - Lớp {s.class}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedStudents.map((s: any) => (
              <span
                key={s.id}
                className="px-2 py-1 bg-gray-200 rounded-full text-xs"
              >
                {s.name}
                <button
                  type="button"
                  className="ml-1 text-red-600"
                  onClick={() => removeStudent(s.id)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">Tạo tài khoản</Button>
        </div>
      </form>
    </div>
  );
}
