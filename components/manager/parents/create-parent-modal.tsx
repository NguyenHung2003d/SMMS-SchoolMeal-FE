"use client";
import React, { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { CreateParentRequest, CreateChildDto } from "@/types/manager-parent";
import { parentService } from "@/services/managerParentService";

interface CreateParentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateParentModal({ open, onClose, onSuccess }: CreateParentModalProps) {
  const [formData, setFormData] = useState<CreateParentRequest>({
    fullName: "",
    email: "",
    phone: "",
    password: "@1",
    children: [],
    relationName: "Phụ huynh",
  });
  const [loading, setLoading] = useState(false);
  const [newChild, setNewChild] = useState<CreateChildDto>({
    fullName: "",
    gender: "M",
    dateOfBirth: "",
    classId: "",
  });

  const handleAddChild = () => {
    if (!newChild.fullName || !newChild.classId) {
      toast.error("Vui lòng nhập tên con và chọn lớp");
      return;
    }
    setFormData({
      ...formData,
      children: [...formData.children, { ...newChild }],
    });
    setNewChild({ fullName: "", gender: "M", dateOfBirth: "", classId: "" });
  };

  const handleRemoveChild = (index: number) => {
    const newChildren = [...formData.children];
    newChildren.splice(index, 1);
    setFormData({ ...formData, children: newChildren });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await parentService.create(formData);
      toast.success("Tạo tài khoản thành công!");
      onSuccess();
      onClose();
      setFormData({ fullName: "", email: "", phone: "", password: "@1", children: [] });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản phụ huynh mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ tên phụ huynh</label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quan hệ</label>
              <Select
                value={formData.relationName}
                onValueChange={(val) => setFormData({ ...formData, relationName: val })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cha">Cha</SelectItem>
                  <SelectItem value="Mẹ">Mẹ</SelectItem>
                  <SelectItem value="Phụ huynh">Phụ huynh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mặc định: @1"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-bold mb-3">Thông tin học sinh (Con)</h3>
            
            {formData.children.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.children.map((child, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded border text-sm">
                    <span>
                      <strong>{child.fullName}</strong> - {child.gender === 'M' ? 'Nam' : 'Nữ'}
                      {/* (Lớp: {MOCK_CLASSES.find(c => c.id === child.classId)?.name}) */}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChild(idx)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-12 gap-2 items-end bg-blue-50 p-3 rounded-md">
              <div className="col-span-4">
                <Input
                  placeholder="Tên học sinh"
                  value={newChild.fullName}
                  onChange={(e) => setNewChild({ ...newChild, fullName: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={newChild.gender}
                  onValueChange={(val) => setNewChild({ ...newChild, gender: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Nam</SelectItem>
                    <SelectItem value="F">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Select
                  value={newChild.classId}
                  onValueChange={(val) => setNewChild({ ...newChild, classId: val })}
                >
                  <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                  {/* <SelectContent>
                    {MOCK_CLASSES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent> */}
                </Select>
              </div>
              <div className="col-span-3">
                <Button type="button" onClick={handleAddChild} className="w-full text-xs">
                  + Thêm con
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo tài khoản
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}