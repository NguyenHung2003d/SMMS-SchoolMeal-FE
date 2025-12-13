"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bot, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminSchoolService } from "@/services/admin/adminSchool.service";
import {
  CreateSchoolDto,
  SchoolDTO,
  UpdateSchoolDto,
} from "@/types/admin-school";

import SchoolFormModal from "@/components/admin/schools/SchoolFormModal";
import DeleteSchoolModal from "@/components/admin/schools/DeleteSchoolModal";
import { adminSchoolRevenueService } from "@/services/admin/adminRevenue.service";
import SchoolCard from "@/components/admin/schools/SchoolCard";
import SchoolFilters from "@/components/admin/schools/SchoolFilters";
import { adminAiMenuService } from "@/services/admin/adminAiMenu.service";
import { cn } from "@/lib/utils";

export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<SchoolDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schoolToDeleteId, setSchoolToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [needsRebuild, setNeedsRebuild] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const data = await adminSchoolService.getAll();
      setSchools(data);
    } catch (error) {
      toast.error("Không thể tải danh sách trường học");
    } finally {
      setLoading(false);
    }
  };

  const checkAiStatus = async () => {
    try {
      const needed = await adminAiMenuService.checkNeedRebuild();
      setNeedsRebuild(needed);
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái AI", error);
    }
  };

  useEffect(() => {
    loadSchools();
    checkAiStatus();
  }, []);

  const handleRebuildAi = async () => {
    try {
      setIsRebuilding(true);
      await adminAiMenuService.rebuild();
      toast.success("Đã gửi yêu cầu xây dựng lại dữ liệu AI");
      setNeedsRebuild(false);
    } catch (error) {
      toast.error("Lỗi khi gửi yêu cầu rebuild AI");
    } finally {
      setIsRebuilding(false);
    }
  };

  const handleToggleStatus = async (
    schoolId: string,
    currentStatus: boolean
  ) => {
    try {
      setTogglingId(schoolId);
      const newStatus = !currentStatus;

      await adminSchoolService.updateManagerStatus(schoolId, newStatus);

      setSchools((prev) =>
        prev.map((s) =>
          s.schoolId === schoolId ? { ...s, isActive: newStatus } : s
        )
      );

      toast.success(
        `Đã ${
          newStatus ? "kích hoạt" : "vô hiệu hóa"
        } quản lý trường thành công`
      );
    } catch (error) {
      console.error(error);
      toast.error("Lỗi cập nhật trạng thái");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateOrUpdate = async (
    schoolData: CreateSchoolDto | UpdateSchoolDto,
    contractData?: any
  ) => {
    try {
      setIsSubmitting(true);
      let newSchoolId = "";

      if (editingSchool) {
        await adminSchoolService.update(
          editingSchool.schoolId,
          schoolData as UpdateSchoolDto
        );
        newSchoolId = editingSchool.schoolId;
        toast.success("Cập nhật trường học thành công");
      } else {
        const response = await adminSchoolService.create(
          schoolData as CreateSchoolDto
        );
        newSchoolId =
          response?.id || (typeof response === "string" ? response : "");

        toast.success("Thêm trường học thành công");

        if (contractData && newSchoolId) {
          try {
            await adminSchoolRevenueService.create({
              ...contractData,
              schoolId: newSchoolId,
            });
            toast.success("Đã tạo hợp đồng liên kết");
          } catch (contractErr) {
            console.error(contractErr);
            toast.error("Tạo trường thành công, nhưng LỖI tạo hợp đồng");
          }
        }
      }
      setIsModalOpen(false);
      setEditingSchool(null);
      loadSchools();
      checkAiStatus();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContractUpdate = async (
    revenueId: number,
    data: any,
    file?: File | null
  ) => {
    await adminSchoolRevenueService.update(revenueId, data, file);
  };

  const handleContractDelete = async (revenueId: number) => {
    await adminSchoolRevenueService.delete(revenueId);
  };

  const confirmDelete = async () => {
    if (!schoolToDeleteId) return;
    try {
      setIsDeleting(true);
      await adminSchoolService.delete(schoolToDeleteId);
      toast.success("Đã xóa (vô hiệu hóa) trường học");
      loadSchools();
      setIsDeleteModalOpen(false);
      checkAiStatus();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsDeleting(false);
      setSchoolToDeleteId(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setSchoolToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingSchool(null);
    setIsModalOpen(true);
  };

  const openEditModal = (school: SchoolDTO) => {
    setEditingSchool(school);
    setIsModalOpen(true);
  };

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contactEmail &&
        s.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = true;
    if (filterStatus === "active") {
      matchesFilter = s.isActive === true;
    } else if (filterStatus === "inactive") {
      matchesFilter = s.isActive === false;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý trường học
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hệ thống quản lý đối tác giáo dục của EduMeal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRebuildAi}
            disabled={!needsRebuild || isRebuilding}
            className={cn(
              "relative px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm",
              needsRebuild
                ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            )}
          >
            {isRebuilding ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Bot size={20} />
            )}
            <span className="font-medium">Xây dựng lại AI</span>
            {needsRebuild && !isRebuilding && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </Button>

          <Button
            onClick={openCreateModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            <span className="font-medium">Thêm trường mới</span>
          </Button>
        </div>
      </div>

      <SchoolFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.schoolId}
                school={school}
                togglingId={togglingId}
                onToggleStatus={handleToggleStatus}
                onOpenEditModal={openEditModal}
                onOpenDeleteModal={openDeleteModal}
              />
            ))}
          </div>
          {filteredSchools.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400">Không tìm thấy trường học nào.</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 text-sm text-gray-500">
            <p>Hiển thị: {filteredSchools.length} kết quả</p>
            <div className="flex items-center space-x-1">
              <button
                disabled
                className="p-2 rounded-l-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-orange-500 text-white font-medium">
                1
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      <SchoolFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchool(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSchool}
        isSubmitting={isSubmitting}
        onContractUpdate={handleContractUpdate}
        onContractDelete={handleContractDelete}
      />
      <DeleteSchoolModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
