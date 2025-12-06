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
import { managerClassService } from "@/services/manager/managerClass.service";
import { managerParentService } from "@/services/manager/managerParent.service";
import { CreateChildDto, UpdateParentRequest } from "@/types/manager-parent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Baby,
  CalendarDays,
  GraduationCap,
  Info,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Phone,
  Plus,
  ShieldAlert,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EditParentModalProps {
  open: boolean;
  onClose: () => void;
  parentToEdit: any;
  onSuccess?: () => void;
}

export function EditParentModal({
  open,
  onClose,
  parentToEdit,
  onSuccess,
}: EditParentModalProps) {
  const queryClient = useQueryClient();

  const canEdit = parentToEdit?.isDefaultPassword === true;
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

  const handleUpdateChild = (index: number, field: string, value: any) => {
    if (!canEdit) return;
    const updatedChildren = [...formData.children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    setFormData({ ...formData, children: updatedChildren });
  };

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
            studentId: child.studentId,
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
    if (!canEdit) return;
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
    if (!canEdit) return;
    const newArr = [...formData.children];
    newArr.splice(index, 1);
    setFormData({ ...formData, children: newArr });
    toast.success(
      "Đã xóa học sinh khỏi danh sách nháp. Bấm 'Lưu thay đổi' để hoàn tất."
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      toast.error("Tài khoản đã kích hoạt, bạn không thể chỉnh sửa.");
      return;
    }
    setLoading(true);
    try {
      await managerParentService.update(parentToEdit.userId, formData);
      toast.success("Cập nhật thành công!");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
          {/* HEADER */}
          <div
            className={`px-8 py-5 sticky top-0 z-50 shadow-md ${
              canEdit
                ? "bg-gradient-to-r from-orange-500 to-red-600"
                : "bg-gradient-to-r from-slate-700 to-slate-900"
            }`}
          >
            <div className="relative z-10 text-white flex items-center justify-between">
              <div className="text-2xl font-bold flex items-center gap-3">
                {canEdit ? (
                  <>
                    <Pencil className="w-6 h-6" />
                    <span>Cập nhật hồ sơ</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-6 h-6" />
                    <span>Chi tiết hồ sơ</span>
                  </>
                )}
              </div>

              <div className="flex items-center">
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 bg-slate-50">
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
              {/* SECTION 1: PARENT INFO */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      Thông tin Phụ huynh
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Họ và tên
                    </label>
                    <Input
                      required
                      disabled={!canEdit}
                      className="bg-white border-slate-200 h-11 text-base disabled:bg-slate-100"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Quan hệ
                    </label>
                    <Select
                      disabled={!canEdit}
                      value={formData.relationName}
                      onValueChange={(v) =>
                        setFormData({ ...formData, relationName: v })
                      }
                    >
                      <SelectTrigger className="bg-white border-slate-200 h-11 text-base disabled:bg-slate-100">
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
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Email
                    </label>
                    <Input
                      disabled={!canEdit}
                      className="bg-white border-slate-200 h-11 text-base disabled:bg-slate-100"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Số điện thoại
                    </label>
                    <Input
                      required
                      disabled={!canEdit}
                      className="bg-white border-slate-200 h-11 text-base disabled:bg-slate-100"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Lock size={14} /> Mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      disabled={!canEdit}
                      className="bg-white border-slate-200 h-11 text-base disabled:bg-slate-100"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={
                        canEdit
                          ? "Để trống nếu không muốn đổi mật khẩu..."
                          : "••••••••••••"
                      }
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: CHILDREN INFO */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Users size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    Danh sách học sinh
                  </h3>
                </div>

                <div className="space-y-4">
                  {formData.children.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-slate-300">
                      <Baby className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">
                        Chưa có thông tin học sinh
                      </p>
                    </div>
                  )}

                  {formData.children.map((child, index) => {
                    // --- READ ONLY MODE ---
                    if (!canEdit) {
                      const cls = classesList.find(
                        (c: any) => c.classId === child.classId
                      );
                      return (
                        <div
                          key={index}
                          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl">
                              {child.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg">
                                {child.fullName}
                              </p>
                              <div className="flex items-center gap-3 text-slate-500 mt-1 text-sm">
                                <span>
                                  {child.gender === "M" ? "Nam" : "Nữ"}
                                </span>
                                {child.dateOfBirth && (
                                  <span className="flex items-center gap-1">
                                    <CalendarDays size={14} />
                                    {formatDate(child.dateOfBirth)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm">
                            {cls?.className || "Chưa xếp"}
                          </div>
                        </div>
                      );
                    }

                    // --- EDIT MODE ---
                    return (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-orange-300 transition-all"
                      >
                        {/* GRID SYSTEM CHUẨN 12 CỘT 
                            - Tên: 4 cols
                            - Ngày sinh: 3 cols
                            - Giới tính: 2 cols
                            - Lớp: 2 cols
                            - Nút xóa: 1 col
                        */}
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">
                              Họ và tên
                            </label>
                            <Input
                              className="bg-slate-50 border-slate-200 h-11 text-sm font-medium focus:bg-white"
                              value={child.fullName}
                              onChange={(e) =>
                                handleUpdateChild(
                                  index,
                                  "fullName",
                                  e.target.value
                                )
                              }
                              placeholder="Nhập tên..."
                            />
                          </div>

                          <div className="col-span-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">
                              Ngày sinh
                            </label>
                            <Input
                              type="date"
                              className="bg-slate-50 border-slate-200 h-11 text-sm focus:bg-white"
                              value={
                                child.dateOfBirth
                                  ? child.dateOfBirth.split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                handleUpdateChild(
                                  index,
                                  "dateOfBirth",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">
                              Giới tính
                            </label>
                            <Select
                              value={child.gender}
                              onValueChange={(v) =>
                                handleUpdateChild(index, "gender", v)
                              }
                            >
                              <SelectTrigger className="bg-slate-50 border-slate-200 h-11 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="M">Nam</SelectItem>
                                <SelectItem value="F">Nữ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">
                              Lớp
                            </label>
                            <Select
                              value={child.classId || ""}
                              onValueChange={(v) =>
                                handleUpdateChild(index, "classId", v)
                              }
                            >
                              <SelectTrigger className="bg-slate-50 border-slate-200 h-11 text-sm">
                                <SelectValue placeholder="Chọn" />
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

                          <div className="col-span-1 flex justify-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-11 w-11 rounded-lg shadow-sm"
                              onClick={() => handleRemoveChild(index)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* FORM ADD NEW */}
                  {canEdit && (
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold text-sm uppercase">
                        <Plus className="w-4 h-4" /> Thêm học sinh mới
                      </div>

                      {/* Sử dụng cùng cấu trúc Grid 12 cột để đồng bộ kích thước */}
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4">
                          <label className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 block">
                            Họ tên
                          </label>
                          <Input
                            className="bg-white border-blue-200 h-11 text-sm shadow-sm"
                            value={newChild.fullName}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setNewChild({
                                ...newChild,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="Nhập tên..."
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 block">
                            Ngày sinh
                          </label>
                          <Input
                            type="date"
                            disabled={!canEdit}
                            className="bg-white border-blue-200 h-11 text-sm shadow-sm"
                            value={newChild.dateOfBirth}
                            onChange={(e) =>
                              setNewChild({
                                ...newChild,
                                dateOfBirth: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 block">
                            Giới tính
                          </label>
                          <Select
                            disabled={!canEdit}
                            value={newChild.gender}
                            onValueChange={(v) =>
                              setNewChild({ ...newChild, gender: v })
                            }
                          >
                            <SelectTrigger className="bg-white border-blue-200 h-11 text-sm shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Nam</SelectItem>
                              <SelectItem value="F">Nữ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 block">
                            Lớp
                          </label>
                          <Select
                            disabled={!canEdit}
                            value={newChild.classId}
                            onValueChange={(v) =>
                              setNewChild({ ...newChild, classId: v })
                            }
                          >
                            <SelectTrigger className="bg-white border-blue-200 h-11 text-sm shadow-sm">
                              <SelectValue placeholder="Chọn" />
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
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            disabled={!canEdit}
                            onClick={handleAddChild}
                            className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg p-0 flex items-center justify-center"
                          >
                            <Plus size={24} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </form>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-6 text-slate-700"
            >
              Đóng
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !canEdit}
              className={`h-11 px-6 min-w-[140px] font-bold text-white shadow-lg transition-all rounded-lg ${
                canEdit
                  ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
              {canEdit ? "Lưu thay đổi" : "Không thể sửa"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
