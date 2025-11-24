import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffDto } from "@/types/manager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { managerService } from "@/services/managerStaffService";

interface DeleteStaffModalProps {
  staff: StaffDto;
  onClose: () => void;
}

export default function DeleteStaffModal({
  staff,
  onClose,
}: DeleteStaffModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => managerService.deleteStaff(id),
    onSuccess: () => {
      toast.success("Đã xóa tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(staff.userId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center mb-4 text-xl font-bold text-red-600">
          <Trash2 size={24} className="mr-2" /> Xóa tài khoản
        </div>
        <div className="mb-6 text-gray-600">
          Bạn có chắc chắn muốn xóa tài khoản của{" "}
          <strong>{staff.fullName}</strong>?
          <div className="mt-3 bg-red-50 border border-red-100 rounded p-3 text-sm text-red-600 flex items-start">
            <AlertTriangle size={16} className="mr-2 mt-0.5 shrink-0" />
            Hành động này không thể hoàn tác. Dữ liệu liên quan đến nhân viên
            này có thể bị ảnh hưởng.
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={deleteMutation.isPending}
          >
            Hủy
          </button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
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
