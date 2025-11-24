"use client";
import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { StaffDto } from "@/types/manager";
import { managerService } from "@/services/managerStaffService";
import StaffToolbar from "@/components/manager/staff/StaffToolbar";
import StaffTable from "@/components/manager/staff/StaffTable";
import StatusStaffModal from "@/components/manager/staff/StatusStaffModal";
import StaffFormModal from "@/components/manager/staff/StaffFormModal";
import DeleteStaffModal from "@/components/manager/staff/DeleteStaffModal";

export default function ManagerStaff() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all")

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
  } = useQuery({
    queryKey: ["staff", { keyword: debouncedSearch, role: selectedRole }],
    queryFn: () => managerService.getStaffList(debouncedSearch, selectedRole),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

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
        <Button onClick={handleCreate} className="flex items-center">
          <UserPlus size={16} className="mr-2" />
          Tạo tài khoản
        </Button>
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
