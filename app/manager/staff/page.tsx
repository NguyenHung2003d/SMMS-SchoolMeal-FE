"use client";
import React, { useEffect, useState } from "react";
import { RefreshCcw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { StaffDto } from "@/types/manager";
import { managerService } from "@/services/manager/managerStaff.service";
import StaffToolbar from "@/components/manager/staff/StaffToolbar";
import StaffTable from "@/components/manager/staff/StaffTable";
import StatusStaffModal from "@/components/manager/staff/StatusStaffModal";
import StaffFormModal from "@/components/manager/staff/StaffFormModal";
import DeleteStaffModal from "@/components/manager/staff/DeleteStaffModal";
import toast from "react-hot-toast";

export default function ManagerStaff() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffDto | null>(null);
  const [selectedStaffForStatus, setSelectedStaffForStatus] =
    useState<StaffDto | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffDto | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: staffList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["staff", { keyword: debouncedSearch, role: selectedRole }],
    queryFn: () => managerService.getStaffList(debouncedSearch, selectedRole),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const toastId = toast.loading("Đang cập nhật danh sách...");
    try {
      await refetch();
      toast.success("Dữ liệu đã được làm mới", { id: toastId });
    } catch (error) {
      toast.error("Lỗi khi tải lại dữ liệu", { id: toastId });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreate = () => {
    setStaffToEdit(null);
    setShowFormModal(true);
  };

  const handleEdit = (staff: StaffDto) => {
    setStaffToEdit(staff);
    setShowFormModal(true);
  };

  const handleDelete = (staff: StaffDto) => {
    setStaffToDelete(staff);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý nhân sự</h1>
          <p className="text-gray-600">
            Tạo và quản lý tài khoản cho giáo viên và nhân viên
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
            title="Tải lại dữ liệu"
          >
            <RefreshCcw
              size={16}
              className={`${isRefreshing ? "animate-spin text-blue-600" : ""}`}
            />
          </Button>

          <Button onClick={handleCreate} className="flex items-center bg-orange-600 hover:bg-orange-700">
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

      <StaffTable
        staffList={staffList}
        isLoading={isLoading}
        isError={isError}
        onOpenStatusModal={(staff) => setSelectedStaffForStatus(staff)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showFormModal && (
        <StaffFormModal
          onClose={() => setShowFormModal(false)}
          staffToEdit={staffToEdit}
        />
      )}

      {selectedStaffForStatus && (
        <StatusStaffModal
          staff={selectedStaffForStatus}
          onClose={() => setSelectedStaffForStatus(null)}
        />
      )}

      {staffToDelete && (
        <DeleteStaffModal
          staff={staffToDelete}
          onClose={() => setStaffToDelete(null)}
        />
      )}
    </div>
  );
}
