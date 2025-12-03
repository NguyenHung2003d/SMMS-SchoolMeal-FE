"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminSchoolService } from "@/services/adminSchool.service";
import {
  CreateSchoolDto,
  SchoolDTO,
  UpdateSchoolDto,
} from "@/types/admin-school";

import SchoolFormModal from "@/components/admin/schools/SchoolFormModal";
import DeleteSchoolModal from "@/components/admin/schools/DeleteSchoolModal";
import { adminSchoolRevenueService } from "@/services/adminRevenue.service";

export default function SchoolManagementPage() {
  const [schools, setSchools] = useState<SchoolDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schoolToDeleteId, setSchoolToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    loadSchools();
  }, []);

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
        const createdSchool = await adminSchoolService.create(
          schoolData as CreateSchoolDto
        );

        newSchoolId = createdSchool?.id;

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
      loadSchools();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setSchoolToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!schoolToDeleteId) return;
    try {
      setIsDeleting(true);
      await adminSchoolService.delete(schoolToDeleteId);
      toast.success("Đã xóa (vô hiệu hóa) trường học");
      loadSchools();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsDeleting(false);
      setSchoolToDeleteId(null);
    }
  };

  const openCreateModal = () => {
    setEditingSchool(null);
    setIsModalOpen(true);
  };

  const openEditModal = (school: SchoolDTO) => {
    setEditingSchool(school);
    setIsModalOpen(true);
  };

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
        <Button
          onClick={openCreateModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          <span className="font-medium">Thêm trường mới</span>
        </Button>
      </div>
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[280px] relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none min-w-[180px] cursor-pointer"
          >
            <option value="active">Đang hoạt động</option>
            <option value="all">Tất cả trạng thái</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.schoolId}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 p-5 relative flex flex-col"
              >
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      school.isActive
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {school.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </div>

                <div className="mb-4 pr-16">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                    {school.schoolName}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-500">
                    <div className="flex items-start">
                      <MapPin
                        size={14}
                        className="mr-2 text-orange-500 mt-0.5 shrink-0"
                      />
                      <span className="line-clamp-2">
                        {school.schoolAddress || "Chưa cập nhật địa chỉ"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone
                        size={14}
                        className="mr-2 text-orange-500 shrink-0"
                      />
                      <span>{school.hotline || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail
                        size={14}
                        className="mr-2 text-orange-500 shrink-0"
                      />
                      <span className="truncate">
                        {school.contactEmail || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-gray-600">
                    <Users size={16} className="mr-1.5 text-blue-500" />
                    <span>{school.studentCount} học sinh</span>
                  </div>

                  <div className="flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                    <button
                      title="Chỉnh sửa"
                      onClick={() => openEditModal(school)}
                      className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>

                    {school.isActive && (
                      <button
                        title="Vô hiệu hóa (Xóa mềm)"
                        onClick={() => openDeleteModal(school.schoolId)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
              <button className="p-2 rounded-l-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-orange-500 text-white font-medium">
                1
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
      <SchoolFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSchool}
        isSubmitting={isSubmitting}
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
