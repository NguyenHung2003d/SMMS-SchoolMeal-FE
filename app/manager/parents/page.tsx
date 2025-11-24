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
import { parentService } from "@/services/managerParentService";
import { ParentTable } from "@/components/manager/parents/parent-table";
import { CreateParentModal } from "@/components/manager/parents/create-parent-modal";
import { ImportExcelModal } from "@/components/manager/parents/import-excel-modal";

interface ClassDto {
  classId: string;
  className: string;
}

export default function ManagerParentsPage() {
  const [parents, setParents] = useState<ParentAccountDto[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await parentService.getAll(); 
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
        responseData = await parentService.search(searchTerm);
      } else {
        responseData = await parentService.getAll(); 
      }

      let dataToSet: ParentAccountDto[] = [];

      if (responseData?.data && Array.isArray(responseData.data)) {
        dataToSet = responseData.data;
      } else if (Array.isArray(responseData)) {
        dataToSet = responseData;
      }

      console.log(`API trả về: ${dataToSet.length} phụ huynh`);
      if (dataToSet.length > 0) {
        console.log("Dữ liệu mẫu:", dataToSet[0]);
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

  const handleDownloadTemplate = async () => {
    try {
      const blob = await parentService.downloadTemplate();
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
      await parentService.delete(userId);
      toast.success("Xóa thành công");
      fetchParents();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const handleChangeStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await parentService.changeStatus(userId, !currentStatus);
      toast.success("Cập nhật trạng thái thành công");
      fetchParents();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
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
           {/* Nút làm mới thủ công để test xem dữ liệu có về không */}
          <Button variant="outline" onClick={fetchParents} title="Làm mới dữ liệu">
            <RefreshCcw size={16} />
          </Button>
          
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <FileDown size={16} className="mr-2" /> Mẫu Excel
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <FileUp size={16} className="mr-2" /> Nhập Excel
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
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
        <div className="w-full md:w-[200px]">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả các lớp</SelectItem>
              {/* Map danh sách lớp thực tế vào đây */}
               {classes.map((cls) => (
                  <SelectItem key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </SelectItem>
               ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ParentTable
        data={parents}
        loading={loading}
        onDelete={handleDelete}
        onStatusChange={handleChangeStatus}
      />

      <CreateParentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchParents}
      />

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