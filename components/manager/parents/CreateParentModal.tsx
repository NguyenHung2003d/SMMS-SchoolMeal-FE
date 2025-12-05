"use client";
import React, { useState } from "react";
import {
  Loader2,
  Trash2,
  Plus,
  User,
  Mail,
  Phone,
  Lock,
  Users,
  CalendarDays,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { managerClassService } from "@/services/managerClass.service";
import { managerParentService } from "@/services/managerParent.service";
import { formatDate } from "@/helpers";

interface CreateParentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateParentModal({
  open,
  onClose,
  onSuccess,
}: CreateParentModalProps) {
  const { data: classesResponse } = useQuery({
    queryKey: ["classes-for-parent-modal"],
    queryFn: () => managerClassService.getAll(),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  const classesList = classesResponse?.data || [];

  const [formData, setFormData] = useState<CreateParentRequest>({
    fullName: "",
    email: "",
    phone: "",
    password: "@1",
    children: [],
    relationName: "Phụ huynh",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State hiển thị mật khẩu

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
    if (formData.children.length === 0) {
      toast.error("Vui lòng thêm ít nhất một học sinh.");
      return;
    }

    setLoading(true);
    try {
      await managerParentService.create(formData);
      toast.success("Tạo tài khoản thành công!");
      onSuccess();
      onClose();
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "@1",
        children: [],
        relationName: "Phụ huynh",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const calculateClassAge = (className: string | undefined) => {
    if (!className) return null;

    const match = className.match(/\d+/);
    if (!match) return null;

    const grade = parseInt(match[0]);
    const currentYear = new Date().getFullYear();

    const targetYear = currentYear - (grade + 5);

    return {
      targetDate: `${targetYear}-01-01`,
      min: `${targetYear - 2}-01-01`,
      max: `${targetYear + 1}-12-31`,
      suggestedYear: targetYear,
    };
  };

  const getDateConstraints = () => {
    if (!newChild.classId)
      return {
        min: undefined,
        max: undefined,
      };

    const selectedClass = classesList.find(
      (c: any) => c.classId === newChild.classId
    );
    if (!selectedClass) return { min: undefined, max: undefined };
    const match = selectedClass.className.match(/\d+/);
    if (!match) return { min: undefined, max: undefined };
    const grade = parseInt(match[0]);
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - (grade + 5);
    const minYear = targetYear - 2;
    const maxYear = targetYear + 1;
    return {
      min: `${minYear}-01-01`,
      max: `${maxYear}-12-31`,
      suggestedYear: targetYear,
    };
  };

  const dateConstraints = getDateConstraints();

  const currentClass = classesList.find(
    (c: any) => c.classId === newChild.classId
  );
  const ageConstraints = currentClass
    ? calculateClassAge(currentClass.className)
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 -mt-6 px-6 py-5 mb-2 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6" />
            Tạo tài khoản phụ huynh mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-2">
          {/* Parent Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2 border-blue-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                Thông tin phụ huynh
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Họ và tên
                </label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Quan hệ
                </label>
                <Select
                  value={formData.relationName}
                  onValueChange={(val) =>
                    setFormData({ ...formData, relationName: val })
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cha">Cha</SelectItem>
                    <SelectItem value="Mẹ">Mẹ</SelectItem>
                    <SelectItem value="Phụ huynh">Phụ huynh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" /> Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" /> Số điện thoại
                </label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0912345678"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" /> Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Mặc định: @1"
                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t-2 border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2 border-green-100">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                Thông tin học sinh
              </h3>
              {formData.children.length > 0 && (
                <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {formData.children.length} học sinh
                </span>
              )}
            </div>

            {formData.children.length > 0 && (
              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-2">
                {formData.children.map((child, idx) => {
                  const foundClass = classesList.find(
                    (c: any) => c.classId === child.classId
                  );
                  const className = foundClass
                    ? foundClass.className
                    : "Chưa xác định";

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
                            {child.gender === "M" ? "👦" : "👧"}
                          </div>
                          <span className="font-bold text-gray-900 text-lg">
                            {child.fullName}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm items-center">
                          <span className="px-3 py-1 bg-white rounded-full text-xs border border-gray-200 font-medium">
                            {child.gender === "M" ? "Nam" : "Nữ"}
                          </span>

                          {child.dateOfBirth && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200 font-medium">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {formatDate(child.dateOfBirth)}
                            </span>
                          )}

                          <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs border border-indigo-200 font-semibold">
                            <BookOpen className="w-3.5 h-3.5" />
                            {className}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveChild(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 h-9 w-9 p-0 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-8 rounded-xl border-2 border-blue-200 shadow-sm">
              <h4 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Thêm học sinh mới
              </h4>

              <div className="grid grid-cols-1 gap-5 mb-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                    Họ và tên con
                  </label>
                  <Input
                    placeholder="Nhập tên học sinh..."
                    value={newChild.fullName}
                    onChange={(e) =>
                      setNewChild({ ...newChild, fullName: e.target.value })
                    }
                    className="h-12 bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                    Lớp học
                  </label>
                  <Select
                    value={newChild.classId}
                    onValueChange={(val) => {
                      const selectedClass = classesList.find(
                        (c: any) => c.classId === val
                      );
                      const constraints = calculateClassAge(
                        selectedClass?.className
                      );
                      setNewChild({
                        ...newChild,
                        classId: val,
                        dateOfBirth: constraints ? constraints.targetDate : "",
                      });
                    }}
                  >
                    <SelectTrigger className="h-12 bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-base">
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      {classesList.length === 0 ? (
                        <div className="p-2 text-xs text-center text-gray-500">
                          Không có lớp nào
                        </div>
                      ) : (
                        classesList.map((c: any) => (
                          <SelectItem key={c.classId} value={c.classId}>
                            {c.className}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                      Giới tính
                    </label>
                    <Select
                      value={newChild.gender}
                      onValueChange={(val) =>
                        setNewChild({ ...newChild, gender: val })
                      }
                    >
                      <SelectTrigger className="h-12 bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">👦 Nam</SelectItem>
                        <SelectItem value="F">👧 Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                      </div>
                      <Input
                        type="date"
                        min={ageConstraints?.min}
                        max={ageConstraints?.max}
                        value={newChild.dateOfBirth || ""}
                        onChange={(e) =>
                          setNewChild({
                            ...newChild,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="pl-12 h-12 bg-white border-blue-300 focus:border-blue-500 rounded-lg text-base w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <Button
                  type="button"
                  onClick={handleAddChild}
                  className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                >
                  <Plus size={20} className="mr-2" />
                  Thêm học sinh
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t-2 border-gray-100 pt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
