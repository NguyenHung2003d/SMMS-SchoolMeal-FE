"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  UserPlus,
  FileDown,
  FileUp,
  RefreshCcw,
  Loader2,
} from "lucide-react";
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
import { managerClassService } from "@/services/manager/managerClass.service";
import { managerParentService } from "@/services/manager/managerParent.service";

import { ParentTable } from "@/components/manager/parents/ParentTable";
import { CreateParentModal } from "@/components/manager/parents/CreateParentModal";
import { ImportExcelModal } from "@/components/manager/parents/ImportExcelModal";
import { EditParentModal } from "@/components/manager/parents/EditParentModal";

import { useDebounce } from "@/hooks/useDebounce";

export default function ManagerParentsPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500); // 2. Debounce search input
  const [selectedClassId, setSelectedClassId] = useState<string>("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [parentToEdit, setParentToEdit] = useState<ParentAccountDto | null>(
    null
  );

  const { data: classes = [] } = useQuery({
    queryKey: ["classes-list"],
    queryFn: async () => {
      const res = await managerClassService.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 giờ
  });

  const {
    data: parents = [],
    isLoading: loading,
    isRefetching,
  } = useQuery({
    queryKey: ["parents-list", debouncedSearch], // Key phụ thuộc vào search
    queryFn: async () => {
      let res;
      if (debouncedSearch.trim() !== "") {
        res = await managerParentService.search(debouncedSearch);
      } else {
        res = await managerParentService.getAll();
      }
      return (res?.data ||
        (Array.isArray(res) ? res : [])) as ParentAccountDto[];
    },
    staleTime: 1000 * 60 * 5, // Data tươi trong 5 phút
    placeholderData: (previousData) => previousData, // Giữ data cũ khi đang fetch data mới (tránh giật layout)
  });

  const filteredParents = useMemo(() => {
    if (selectedClassId === "all") return parents;
    return parents.filter((p) =>
      p.children?.some((child) => child.classId === selectedClassId)
    );
  }, [parents, selectedClassId]);

  const deleteMutation = useMutation({
    mutationFn: managerParentService.delete,
    onSuccess: () => {
      toast.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["parents-list"] }); // Auto refresh
    },
    onError: () => toast.error("Xóa thất bại"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      managerParentService.changeStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["parents-list"] });
    },
    onError: () => toast.error("Lỗi cập nhật trạng thái"),
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["parents-list"] });
    queryClient.invalidateQueries({ queryKey: ["classes-list"] });
    toast.success("Dữ liệu đang được cập nhật...");
  };

  const handleDelete = (userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      deleteMutation.mutate(userId);
    }
  };

  const handleChangeStatus = (userId: string, currentStatus: boolean) => {
    statusMutation.mutate({ id: userId, status: !currentStatus });
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await managerParentService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Mau_Nhap_PhuHuynh.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Lỗi tải xuống mẫu Excel");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen animate-in fade-in duration-500">
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
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="bg-white"
          >
            <FileDown size={16} className="mr-2" /> Mẫu Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
            className="bg-white"
          >
            <FileUp size={16} className="mr-2" /> Nhập Excel
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all hover:shadow-md"
          >
            <UserPlus size={16} className="mr-2" /> Thêm mới
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên, email, sđt hoặc tên con..."
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-[220px]">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Lọc theo lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các lớp</SelectItem>
                {classes.map((cls: any) => (
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
            disabled={isRefetching}
            className="bg-white hover:bg-gray-50 border-gray-200 px-3"
            title="Làm mới"
          >
            <RefreshCcw
              size={16}
              className={`text-gray-600 ${
                isRefetching ? "animate-spin text-blue-600" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <ParentTable
          data={filteredParents}
          loading={loading && !isRefetching} 
          onDelete={handleDelete}
          onStatusChange={handleChangeStatus}
          onEdit={(parent) => {
            setParentToEdit(parent);
            setShowEditModal(true);
          }}
        />
        {!loading && filteredParents.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Không tìm thấy phụ huynh nào phù hợp.
          </div>
        )}
      </div>

      <CreateParentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["parents-list"] })
        }
      />

      {showEditModal && parentToEdit && (
        <EditParentModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          parentToEdit={parentToEdit}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["parents-list"] })
          }
        />
      )}

      <ImportExcelModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["parents-list"] })
        }
      />
    </div>
  );
}
