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
import { formatDateForInput } from "@/helpers";
import { managerClassService } from "@/services/managerClass.service";
import { managerParentService } from "@/services/managerParent.service";
import { CreateChildDto, UpdateParentRequest } from "@/types/manager-parent";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
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
  const { data: classesResponse } = useQuery({
    queryKey: ["classes-for-parent-modal"],
    queryFn: () => managerClassService.getAll(),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });
  const classesList = classesResponse?.data || [];

  const canEdit = parentToEdit?.password === "@1";

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
    const newArr = [...formData.children];
    newArr.splice(index, 1);
    setFormData({ ...formData, children: newArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
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
          className={`border-b pb-4 -mx-6 -mt-6 px-6 py-5 rounded-t-lg ${
            canEdit ? "bg-orange-600" : "bg-gray-500"
          }`}
        >
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
            {canEdit ? (
              <Pencil className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
            {canEdit
              ? "Cập nhật thông tin Phụ huynh"
              : "Thông tin Phụ huynh (Chỉ xem)"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2 col-span-1 md:col-span-2 bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium flex gap-2 items-center">
                <Lock size={14} /> Mật khẩu mới (Để trống nếu không đổi)
              </label>
              <Input
                type="password"
                disabled={!canEdit}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  canEdit ? "Nhập mật khẩu mới..." : "Không thể đổi mật khẩu"
                }
                className="bg-white disabled:bg-gray-100"
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-green-600 w-5 h-5" />
              <h3 className="font-semibold text-gray-800">
                Thông tin học sinh
              </h3>
            </div>
            <div className="space-y-2 mb-4">
              {formData.children.map((child, index) => {
                const cls = classesList.find(
                  (c: any) => c.classId === child.classId
                );
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-200"
                  >
                    <div className="text-sm">
                      <span className="font-bold block">{child.fullName}</span>
                      <span className="text-gray-500 text-xs flex gap-2 items-center mt-1">
                        <span>{child.gender === "M" ? "Nam" : "Nữ"}</span>
                        {child.dateOfBirth && (
                          <span className="flex items-center">
                            <CalendarDays size={12} className="mr-1" />
                            {formatDateForInput(child.dateOfBirth)}
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-700 px-1 rounded">
                          {cls?.className || "Chưa xếp lớp"}
                        </span>
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={!canEdit}
                      size="sm"
                      onClick={() => handleRemoveChild(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-50 p-3 rounded border grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-semibold text-gray-500">
                  Họ tên
                </label>
                <Input
                  className="bg-white h-9"
                  value={newChild.fullName}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setNewChild({ ...newChild, fullName: e.target.value })
                  }
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="text-xs font-semibold text-gray-500">
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
                <label className="text-xs font-semibold text-gray-500">
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
                <label className="text-xs font-semibold text-gray-500">
                  Lớp
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
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus size={16} className="mr-1" /> Thêm vào danh sách
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Lưu
              thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
