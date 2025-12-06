import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffDto } from "@/types/manager";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { managerService } from "@/services/manager/managerStaff.service";

interface DeleteStaffModalProps {
  staff: StaffDto;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteStaffModal({
  staff,
  onClose,
  onSuccess,
}: DeleteStaffModalProps) {
  const deleteMutation = useMutation({
    mutationFn: (id: string) => managerService.deleteStaff(id),
    onSuccess: () => {
      toast.success("Đã xóa tài khoản thành công");
      onSuccess();
      onClose();
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Xóa thất bại"),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center mb-4 text-xl font-bold text-red-600">
          <Trash2 size={24} className="mr-2" /> Xóa vĩnh viễn tài khoản
        </div>

        <div className="mb-6 text-gray-600">
          Bạn đang yêu cầu xóa tài khoản của <strong>{staff.fullName}</strong>.
          <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-center text-red-700 font-semibold text-sm mb-1">
              <AlertTriangle size={16} className="mr-2" /> Cảnh báo quan trọng:
            </div>
            <p className="text-sm text-red-600 ml-6">
              Hành động này <strong>không thể hoàn tác</strong>. Tất cả dữ liệu
              liên quan đến nhân viên này có thể bị mất hoặc ảnh hưởng. Vui lòng
              cân nhắc kỹ.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate(staff.userId)}
            disabled={deleteMutation.isPending}
            className="font-medium shadow-sm transition-all"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
              </>
            ) : (
              "Xác nhận xóa"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
