"use client";
import React, { useState } from "react";
import { RefreshCcw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { StaffDto } from "@/types/manager";
import { managerService } from "@/services/manager/managerStaff.service";
import StaffToolbar from "@/components/manager/staff/StaffToolbar";
import StaffTable from "@/components/manager/staff/StaffTable";
import StatusStaffModal from "@/components/manager/staff/StatusStaffModal";
import StaffFormModal from "@/components/manager/staff/StaffFormModal";
import DeleteStaffModal from "@/components/manager/staff/DeleteStaffModal";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";

export default function ManagerStaff() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [showFormModal, setShowFormModal] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffDto | null>(null);
  const [selectedStaffForStatus, setSelectedStaffForStatus] = useState<StaffDto | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffDto | null>(null);

  const {
    data: staffList = [],
    isLoading,
    isFetching, 
    isError,
    refetch,
  } = useQuery({
    queryKey: ["staff-list", debouncedSearch, selectedRole], // Key ngắn gọn
    queryFn: () => managerService.getStaffList(debouncedSearch, selectedRole),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, 
    placeholderData: keepPreviousData,
  });

  const handleRefresh = async () => {
    const toastId = toast.loading("Đang cập nhật...");
    try {
      await refetch();
      toast.success("Đã cập nhật", { id: toastId });
    } catch {
      toast.error("Lỗi cập nhật", { id: toastId });
    }
  };

  const handleOperationSuccess = () => {
    refetch();
  };

  const handleCreate = () => {
    setStaffToEdit(null);
    setShowFormModal(true);
  };

  const handleEdit = (staff: StaffDto) => {
    setStaffToEdit(staff);
    setShowFormModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý nhân sự</h1>
          <p className="text-gray-600 text-sm mt-1">
            Tạo và quản lý tài khoản cho giáo viên và nhân viên
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
            className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300 shadow-sm"
            title="Tải lại dữ liệu"
          >
            <RefreshCcw
              size={16}
              className={`${isFetching ? "animate-spin text-blue-600" : "text-gray-600"}`}
            />
          </Button>

          <Button 
            onClick={handleCreate} 
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all active:scale-95"
          >
            <UserPlus size={16} className="mr-2" />
            Tạo tài khoản
          </Button>
        </div>
      </div>

      <StaffToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <StaffTable
          staffList={staffList}
          isLoading={isLoading}
          isError={isError}
          onOpenStatusModal={setSelectedStaffForStatus}
          onEdit={handleEdit}
          onDelete={setStaffToDelete}
        />
      </div>

      {showFormModal && (
        <StaffFormModal
          onClose={() => setShowFormModal(false)}
          staffToEdit={staffToEdit}
          onSuccess={handleOperationSuccess}
        />
      )}

      {selectedStaffForStatus && (
        <StatusStaffModal
          staff={selectedStaffForStatus}
          onClose={() => setSelectedStaffForStatus(null)}
          onSuccess={handleOperationSuccess} 
        />
      )}

      {staffToDelete && (
        <DeleteStaffModal
          staff={staffToDelete}
          onClose={() => setStaffToDelete(null)}
          onSuccess={handleOperationSuccess}
        />
      )}
    </div>
  );
}