"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, FileDown, FileUp, RefreshCcw } from "lucide-react"; // Thêm icon refresh
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { ParentAccountDto } from "@/types/manager-parent";
import { ParentTable } from "@/components/manager/parents/ParentTable";
import { CreateParentModal } from "@/components/manager/parents/CreateParentModal";
import { ImportExcelModal } from "@/components/manager/parents/ImportExcelModal";
import { managerClassService } from "@/services/manager/managerClass.service";
import { ClassDto } from "@/types/manager-class";
import { managerParentService } from "@/services/manager/managerParent.service";
import { EditParentModal } from "@/components/manager/parents/EditParentModal";

export default function ManagerParentsPage() {
  const [parents, setParents] = useState<ParentAccountDto[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [parentToEdit, setParentToEdit] = useState<ParentAccountDto | null>(
    null
  );

  const fetchClasses = async () => {
    try {
      const res = await managerClassService.getAll();
      if (Array.isArray(res)) setClasses(res);
      else if (res?.data && Array.isArray(res.data)) setClasses(res.data);
    } catch (error) {
      console.error("Không thể tải danh sách lớp", error);
    }
  };

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      let responseData;

      console.log("Fetching with:", { searchTerm, selectedClassId });
      if (searchTerm && searchTerm.trim() !== "") {
        responseData = await managerParentService.search(searchTerm);
      } else {
        responseData = await managerParentService.getAll();
      }

      let dataToSet: ParentAccountDto[] = [];

      if (responseData?.data && Array.isArray(responseData.data)) {
        dataToSet = responseData.data;
      } else if (Array.isArray(responseData)) {
        dataToSet = responseData;
      }

      setParents(dataToSet);
    } catch (error) {
      console.error("Lỗi fetch parents:", error);
      toast.error("Không thể tải danh sách phụ huynh");
      setParents([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedClassId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParents();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchParents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    const toastId = toast.loading("Đang làm mới dữ liệu...");

    try {
      await Promise.all([fetchClasses(), fetchParents()]);
      toast.success("Dữ liệu đã được cập nhật", { id: toastId });
    } catch (error) {
      toast.error("Lỗi khi làm mới dữ liệu", { id: toastId });
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await managerParentService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau_Nhap_PhuHuynh.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải xuống mẫu Excel");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await managerParentService.delete(userId);
      toast.success("Xóa thành công");
      fetchParents();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const handleChangeStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await managerParentService.changeStatus(userId, !currentStatus);
      toast.success("Cập nhật trạng thái thành công");
      fetchParents();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleEdit = (parent: ParentAccountDto) => {
    setParentToEdit(parent);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý tài khoản phụ huynh
          </h1>
          <p className="text-gray-600 text-sm">
            Quản lý thông tin, trạng thái và liên kết con của phụ huynh
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <FileDown size={16} className="mr-2" /> Mẫu Excel
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <FileUp size={16} className="mr-2" /> Nhập Excel
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <UserPlus size={16} className="mr-2" /> Thêm mới
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm theo tên, email, sđt hoặc tên con..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-[200px]">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các lớp</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300 px-3"
            title="Tải lại dữ liệu"
          >
            <RefreshCcw
              size={16}
              className={`${isRefreshing ? "animate-spin text-blue-600" : ""}`}
            />
          </Button>
        </div>
      </div>

      <ParentTable
        data={parents}
        loading={loading}
        onDelete={handleDelete}
        onStatusChange={handleChangeStatus}
        onEdit={handleEdit}
      />

      <CreateParentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchParents}
      />

      {showEditModal && parentToEdit && (
        <EditParentModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          parentToEdit={parentToEdit}
          onSuccess={fetchParents}
        />
      )}

      <ImportExcelModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          fetchParents();
        }}
      />
    </div>
  );
}
