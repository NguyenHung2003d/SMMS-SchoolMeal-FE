import React from "react";
import { Lock, Unlock, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffDto } from "@/types/manager";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { managerService } from "@/services/manager/managerStaff.service";

interface StatusStaffModalProps {
  staff: StaffDto;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StatusStaffModal({
  staff,
  onClose,
  onSuccess,
}: StatusStaffModalProps) {
  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: boolean }) =>
      managerService.changeStatus(id, newStatus),
    onSuccess: (_, variables) => {
      toast.success(
        `Đã ${variables.newStatus ? "kích hoạt" : "vô hiệu hóa"} tài khoản`
      );
      onSuccess(); 
      onClose();
    },
    onError: () => toast.error("Không thể thay đổi trạng thái"),
  });

  const handleConfirm = () => {
    statusMutation.mutate({ id: staff.userId, newStatus: !staff.isActive });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center mb-4 text-xl font-bold text-gray-800">
          {staff.isActive ? (
            <>
              <Lock className="text-red-500 mr-2" size={24} /> Vô hiệu hóa tài
              khoản
            </>
          ) : (
            <>
              <Unlock className="text-green-500 mr-2" size={24} /> Kích hoạt tài
              khoản
            </>
          )}
        </div>

        <div className="mb-6 text-gray-600">
          Bạn có chắc chắn muốn{" "}
          {staff.isActive ? "vô hiệu hóa" : "kích hoạt lại"} tài khoản của{" "}
          <strong>{staff.fullName}</strong>?
          {staff.isActive && (
            <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-600 flex items-start">
              <AlertTriangle size={16} className="mr-2 mt-0.5 shrink-0" />
              <span>
                Nhân viên này sẽ không thể đăng nhập vào hệ thống sau khi bị
                khóa.
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={statusMutation.isPending}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <Button
            variant={staff.isActive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={statusMutation.isPending}
            className={`${
              !staff.isActive ? "bg-green-600 hover:bg-green-700" : ""
            } font-medium shadow-sm transition-all`}
          >
            {statusMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {statusMutation.isPending
              ? "Đang xử lý..."
              : staff.isActive
              ? "Xác nhận khóa"
              : "Xác nhận mở"}
          </Button>
        </div>
      </div>
    </div>
  );
}
