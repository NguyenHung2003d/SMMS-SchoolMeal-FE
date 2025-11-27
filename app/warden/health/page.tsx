"use client";

import React, { useEffect, useState } from "react";
import { Activity, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axiosInstance";
import { HealthRecord, HealthFormData } from "@/types/warden-health";

import { HealthCharts } from "@/components/warden/health/HealthCharts";
import { StudentHealthTable } from "@/components/warden/health/StudentHealthTable";
import { UpdateHealthModal } from "@/components/warden/health/UpdateHealthModal";
import { StudentHistoryModal } from "@/components/warden/health/StudentHistoryModal";

export default function TeacherHealthTracking() {
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<HealthRecord[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<HealthRecord | null>(
    null
  );
  const [formData, setFormData] = useState<HealthFormData>({
    heightCm: "",
    weightKg: "",
    recordDate: format(new Date(), "yyyy-MM-dd"),
  });

  const [historyData, setHistoryData] = useState<HealthRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const storedClassId = localStorage.getItem("currentClassId");
    if (storedClassId) {
      setClassId(storedClassId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (classId) fetchData();
  }, [classId]);

  const fetchData = async () => {
    if (!classId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/WardensHealth/class/${classId}/health`
      );
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setHealthData(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu sức khỏe:", error);
      toast.error("Không thể tải dữ liệu sức khỏe.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentHistory = async (studentId: string) => {
    try {
      setHistoryLoading(true);
      const res = await axiosInstance.get(
        `/WardensHealth/student/${studentId}/bmi-history`
      );
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const sorted = data.sort(
        (a: HealthRecord, b: HealthRecord) =>
          new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
      );
      setHistoryData(sorted);
    } catch (error) {
      toast.error("Lỗi tải lịch sử đo.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleExport = async () => {
    if (!classId) return;
    try {
      const response = await axiosInstance.get(
        `/WardensHealth/class/${classId}/health/export`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `BaoCao_SucKhoe_${format(new Date(), "yyyyMMdd")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Đã xuất báo cáo thành công!");
    } catch (error) {
      toast.error("Xuất báo cáo thất bại.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await axiosInstance.post(
        `/WardensHealth/student/${selectedStudent.studentId}/bmi`,
        {
          heightCm: parseFloat(formData.heightCm),
          weightKg: parseFloat(formData.weightKg),
          recordDate: new Date(formData.recordDate).toISOString(),
        }
      );

      toast.success("Cập nhật chỉ số thành công!");
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lần đo này?")) return;
    try {
      await axiosInstance.delete(`/WardensHealth/bmi/${recordId}`);
      toast.success("Đã xóa bản ghi.");
      if (selectedStudent) fetchStudentHistory(selectedStudent.studentId);
      fetchData();
    } catch (error) {
      toast.error("Xóa thất bại.");
    }
  };

  const openCreateModal = (student: HealthRecord) => {
    setSelectedStudent(student);
    setFormData({
      heightCm: student.heightCm?.toString() || "",
      weightKg: student.weightKg?.toString() || "",
      recordDate: format(new Date(), "yyyy-MM-dd"),
    });
    setShowCreateModal(true);
  };

  const openHistoryModal = (student: HealthRecord) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
    fetchStudentHistory(student.studentId);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
        <AlertCircle size={48} className="mb-3 text-orange-300" />
        <p>Chưa chọn lớp học. Vui lòng quay lại trang chủ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <Activity className="text-orange-500" /> Theo dõi sức khỏe
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý chỉ số BMI và sự phát triển thể chất của học sinh.
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo Excel
          </Button>
        </div>

        {/* Charts */}
        <HealthCharts data={healthData} />

        {/* Table */}
        <StudentHealthTable
          data={healthData}
          onUpdate={openCreateModal}
          onViewHistory={openHistoryModal}
        />
      </div>

      {/* Modals */}
      <UpdateHealthModal
        open={showCreateModal}
        student={selectedStudent}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />

      <StudentHistoryModal
        open={showHistoryModal}
        student={selectedStudent}
        historyData={historyData}
        loading={historyLoading}
        onClose={() => setShowHistoryModal(false)}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
}
