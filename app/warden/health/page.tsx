"use client";

import React, { useState } from "react";
import { Activity, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { HealthRecord, HealthFormData } from "@/types/warden-health";

import { HealthCharts } from "@/components/warden/health/HealthCharts";
import { StudentHealthTable } from "@/components/warden/health/StudentHealthTable";
import { UpdateHealthModal } from "@/components/warden/health/UpdateHealthModal";
import { StudentHistoryModal } from "@/components/warden/health/StudentHistoryModal";
import { wardenHealthService } from "@/services/wardens/wardenHealth.service";

export default function TeacherHealthTracking() {
  const queryClient = useQueryClient();

  const [selectedStudent, setSelectedStudent] = useState<HealthRecord | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [formData, setFormData] = useState<HealthFormData>({
    heightCm: "",
    weightKg: "",
    recordDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: currentClass, isLoading: loadingClass } = useQuery({
    queryKey: ["wardenClass"],
    queryFn: wardenHealthService.getMyClass,
    staleTime: 1000 * 60 * 30,
  });

  const { data: healthData = [], isLoading: loadingHealth } = useQuery({
    queryKey: ["classHealth", currentClass?.classId],
    queryFn: () => wardenHealthService.getClassHealth(currentClass!.classId),
    enabled: !!currentClass?.classId,
  });

  const { data: historyData = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["studentHistory", selectedStudent?.studentId],
    queryFn: () =>
      wardenHealthService.getStudentHistory(selectedStudent!.studentId),
    enabled: !!selectedStudent?.studentId && showHistoryModal,
  });

  const updateMutation = useMutation({
    mutationFn: wardenHealthService.updateBMI,
    onSuccess: () => {
      toast.success("Cập nhật chỉ số thành công!");
      setShowCreateModal(false);
      queryClient.invalidateQueries({
        queryKey: ["classHealth", currentClass?.classId],
      });
    },
    onError: () => toast.error("Cập nhật thất bại. Vui lòng thử lại."),
  });

  const deleteMutation = useMutation({
    mutationFn: wardenHealthService.deleteBMI,
    onSuccess: () => {
      toast.success("Đã xóa bản ghi.");
      queryClient.invalidateQueries({
        queryKey: ["studentHistory", selectedStudent?.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["classHealth", currentClass?.classId],
      });
    },
    onError: () => toast.error("Xóa thất bại."),
  });

  const handleCreateSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedStudent) return;
    updateMutation.mutate({
      studentId: selectedStudent.studentId,
      data: formData,
    });
  };

  const handleDeleteRecord = (recordId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa lần đo này?")) {
      deleteMutation.mutate(recordId);
    }
  };

  const handleExport = async () => {
    if (!currentClass?.classId) return;
    try {
      const blob = await wardenHealthService.exportReport(currentClass.classId);
      const url = window.URL.createObjectURL(new Blob([blob]));
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
    } catch {
      toast.error("Xuất báo cáo thất bại.");
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
  };

  if (loadingClass || (loadingHealth && !healthData.length)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
        <AlertCircle size={48} className="mb-3 text-orange-300" />
        <p className="text-lg font-semibold">Chưa có thông tin lớp học</p>
        <p className="text-sm">Bạn chưa được phân công phụ trách lớp nào.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans animate-in fade-in duration-500">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <Activity className="text-orange-500" />
              Theo dõi sức khỏe - {currentClass.className}
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

        <HealthCharts data={healthData} />

        <StudentHealthTable
          data={healthData}
          onUpdate={openCreateModal}
          onViewHistory={openHistoryModal}
        />
      </div>

      <UpdateHealthModal
        open={showCreateModal}
        student={selectedStudent}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        loading={updateMutation.isPending}
      />

      <StudentHistoryModal
        open={showHistoryModal}
        student={selectedStudent}
        historyData={historyData}
        loading={loadingHistory || deleteMutation.isPending}
        onClose={() => setShowHistoryModal(false)}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
}
