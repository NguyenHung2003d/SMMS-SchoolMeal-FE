import React from "react";
import { Lock, Unlock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffDto } from "@/types/manager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { managerService } from "@/services/manager/managerStaff.service";

interface StatusStaffModalProps {
  staff: StaffDto;
  onClose: () => void;
}

export default function StatusStaffModal({
  staff,
  onClose,
}: StatusStaffModalProps) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: boolean }) =>
      managerService.changeStatus(id, newStatus),
    onSuccess: (_, variables) => {
      toast.success(
        `Đã ${variables.newStatus ? "kích hoạt" : "vô hiệu hóa"} tài khoản`
      );
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
    },
    onError: () => {
      toast.error("Không thể thay đổi trạng thái");
    },
  });

  const handleConfirm = () => {
    statusMutation.mutate({
      id: staff.userId,
      newStatus: !staff.isActive,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center mb-4 text-xl font-bold">
          {staff.isActive ? (
            <>
              <Lock size={24} className="text-red-500 mr-2" /> Vô hiệu hóa tài
              khoản
            </>
          ) : (
            <>
              <Unlock size={24} className="text-green-500 mr-2" /> Kích hoạt tài
              khoản
            </>
          )}
        </div>
        <div className="mb-6 text-gray-600">
          Bạn có chắc chắn muốn{" "}
          {staff.isActive ? "vô hiệu hóa (cấm)" : "kích hoạt lại"} tài khoản của{" "}
          <strong>{staff.fullName}</strong> không?
          {staff.isActive && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <AlertTriangle size={14} className="mr-1" /> Nhân viên sẽ không
              thể đăng nhập hệ thống.
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={statusMutation.isPending}
          >
            Hủy
          </button>
          <Button
            variant={staff.isActive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={statusMutation.isPending}
            className={!staff.isActive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {statusMutation.isPending
              ? "Đang xử lý..."
              : staff.isActive
              ? "Xác nhận khóa"
              : "Xác nhận mở khóa"}
          </Button>
        </div>
      </div>
    </div>
  );
}
