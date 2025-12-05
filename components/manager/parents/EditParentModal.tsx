import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/helpers";
import { managerClassService } from "@/services/managerClass.service";
import { managerParentService } from "@/services/managerParent.service";
import { CreateChildDto, UpdateParentRequest } from "@/types/manager-parent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Users,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EditParentModalProps {
  open: boolean;
  onClose: () => void;
  parentToEdit: any;
}

export function EditParentModal({
  open,
  onClose,
  parentToEdit,
}: EditParentModalProps) {
  const queryClient = useQueryClient();

  // === LOGIC QUYỀN SỬA ===
  // Nếu pass là "@1" => True (Được sửa). Ngược lại => False (Bị khóa)
  const canEdit = parentToEdit?.password === "@1";

  const { data: classesResponse } = useQuery({
    queryKey: ["classes-for-parent-modal"],
    queryFn: () => managerClassService.getAll(),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });
  const classesList = classesResponse?.data || [];

  const [formData, setFormData] = useState<UpdateParentRequest>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    relationName: "Phụ huynh",
    children: [],
  });

  const [loading, setLoading] = useState(false);
  const [newChild, setNewChild] = useState<CreateChildDto>({
    fullName: "",
    gender: "M",
    dateOfBirth: "",
    classId: "",
  });

  useEffect(() => {
    if (parentToEdit && open) {
      setFormData({
        fullName: parentToEdit.fullName || "",
        email: parentToEdit.email || "",
        phone: parentToEdit.phone || "",
        password: "",
        relationName: parentToEdit.relationName || "Phụ huynh",
        children:
          parentToEdit.children?.map((child: any) => ({
            fullName: child.fullName,
            gender: child.gender || "M",
            dateOfBirth: child.dateOfBirth
              ? child.dateOfBirth.split("T")[0]
              : "",
            classId: child.classId || "",
          })) || [],
      });
    }
  }, [parentToEdit, open]);

  const handleAddChild = () => {
    if (!canEdit) return; // Chặn nếu không có quyền
    if (!newChild.fullName) {
      toast.error("Vui lòng nhập tên con");
      return;
    }
    setFormData({
      ...formData,
      children: [...formData.children, { ...newChild }],
    });
    setNewChild({ fullName: "", gender: "M", dateOfBirth: "", classId: "" });
  };

  const handleRemoveChild = (index: number) => {
    if (!canEdit) return; // Chặn nếu không có quyền
    const newArr = [...formData.children];
    newArr.splice(index, 1);
    setFormData({ ...formData, children: newArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chặn submit nếu không phải pass mặc định
    if (!canEdit) {
      toast.error("Tài khoản đã kích hoạt, bạn không thể chỉnh sửa.");
      return;
    }

    setLoading(true);
    try {
      await managerParentService.update(parentToEdit.userId, formData);
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader
          className={`border-b pb-4 -mx-6 -mt-6 px-6 py-5 rounded-t-lg transition-colors ${
            canEdit ? "bg-orange-600" : "bg-slate-600"
          }`}
        >
          <div className="text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {canEdit ? (
                <>
                  <Pencil className="w-6 h-6" /> Cập nhật thông tin Phụ huynh
                </>
              ) : (
                <>
                  <ShieldAlert className="w-6 h-6" /> Thông tin (Chế độ xem)
                </>
              )}
            </DialogTitle>

            {/* Thông báo trạng thái rõ ràng */}
            <p className="text-white/90 text-sm mt-2 flex items-center gap-1.5 font-medium">
              {canEdit ? (
                <>
                  <Info size={16} /> Tài khoản chưa kích hoạt (Pass: @1) - Được
                  phép sửa.
                </>
              ) : (
                <>
                  <Lock size={16} /> Tài khoản đã đổi mật khẩu - Không thể chỉnh
                  sửa.
                </>
              )}
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Các trường input đều bị disable nếu !canEdit */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ tên phụ huynh</label>
              <Input
                required
                disabled={!canEdit}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quan hệ</label>
              <Select
                disabled={!canEdit}
                value={formData.relationName}
                onValueChange={(v) =>
                  setFormData({ ...formData, relationName: v })
                }
              >
                <SelectTrigger>
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
              <label className="text-sm font-medium flex gap-2 items-center">
                <Mail size={14} /> Email
              </label>
              <Input
                disabled={!canEdit}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex gap-2 items-center">
                <Phone size={14} /> Số điện thoại
              </label>
              <Input
                required
                disabled={!canEdit}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2 bg-gray-50 p-3 rounded border">
              <label className="text-sm font-medium flex gap-2 items-center">
                <Lock size={14} /> Mật khẩu mới
              </label>
              <Input
                type="password"
                disabled={!canEdit}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  canEdit
                    ? "Nhập để đổi mật khẩu (hoặc để trống)..."
                    : "Không thể đổi mật khẩu"
                }
                className="bg-white"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="text-green-600 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">
                  Thông tin học sinh
                </h3>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {formData.children.length === 0 && (
                <div className="text-center py-4 text-gray-400 bg-gray-50 rounded border border-dashed">
                  Chưa có học sinh nào
                </div>
              )}
              {formData.children.map((child, index) => {
                const cls = classesList.find(
                  (c: any) => c.classId === child.classId
                );
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200"
                  >
                    <div className="text-sm">
                      <span className="font-bold text-green-800 block text-base">
                        {child.fullName}
                      </span>
                      <div className="text-gray-600 text-xs flex gap-3 items-center mt-1">
                        <span className="font-medium">
                          {child.gender === "M" ? "Nam" : "Nữ"}
                        </span>
                        {child.dateOfBirth && (
                          <span className="flex items-center">
                            <CalendarDays size={12} className="mr-1" />
                            {formatDate(child.dateOfBirth)}
                          </span>
                        )}
                        <span className="bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-200 font-medium">
                          {cls?.className || "Chưa xếp lớp"}
                        </span>
                      </div>
                    </div>
                    {/* Nút xóa con chỉ hiện/hoạt động khi canEdit=true */}
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={!canEdit}
                      size="sm"
                      onClick={() => handleRemoveChild(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Form thêm con: Ẩn đi hoặc mờ đi nếu không có quyền */}
            <div
              className={`bg-slate-50 p-4 rounded border border-slate-200 grid grid-cols-12 gap-3 items-end transition-opacity ${
                !canEdit ? "opacity-50 pointer-events-none grayscale" : ""
              }`}
            >
              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Họ tên học sinh
                </label>
                <Input
                  className="bg-white h-9"
                  value={newChild.fullName}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setNewChild({ ...newChild, fullName: e.target.value })
                  }
                  placeholder="Nhập tên bé..."
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Ngày sinh
                </label>
                <Input
                  type="date"
                  disabled={!canEdit}
                  className="bg-white h-9"
                  value={newChild.dateOfBirth}
                  onChange={(e) =>
                    setNewChild({ ...newChild, dateOfBirth: e.target.value })
                  }
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Giới tính
                </label>
                <Select
                  disabled={!canEdit}
                  value={newChild.gender}
                  onValueChange={(v) => setNewChild({ ...newChild, gender: v })}
                >
                  <SelectTrigger className="bg-white h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Nam</SelectItem>
                    <SelectItem value="F">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Lớp học
                </label>
                <Select
                  disabled={!canEdit}
                  value={newChild.classId}
                  onValueChange={(v) =>
                    setNewChild({ ...newChild, classId: v })
                  }
                >
                  <SelectTrigger className="bg-white h-9">
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesList.map((c: any) => (
                      <SelectItem key={c.classId} value={c.classId}>
                        {c.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-12 mt-2">
                <Button
                  type="button"
                  disabled={!canEdit}
                  onClick={handleAddChild}
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Plus size={16} className="mr-1" /> Thêm học sinh vào danh
                  sách
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Đóng
            </Button>

            {/* Nút Submit */}
            <Button
              type="submit"
              disabled={loading || !canEdit}
              className={`min-w-[140px] ${
                canEdit
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
              }`}
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {canEdit ? "Lưu thay đổi" : "Không thể sửa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
