"use client";

import React, { useEffect, useState } from "react";
import { useSelectedStudent } from "@/context/SelectedChildContext";
import { axiosInstance } from "@/lib/axiosInstance";
import { AttendanceRequestDto, AttendanceResponseDto } from "@/types/parent";
import { formatDate } from "@/helpers";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Send,
  History,
  XCircle,
} from "lucide-react";
import { attendanceService } from "@/services/parent/attendance.service";

export default function LeaveApplication() {
  const { selectedStudent } = useSelectedStudent();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [history, setHistory] = useState<AttendanceResponseDto[]>([]);

  useEffect(() => {
    if (selectedStudent?.studentId) {
      fetchHistory(selectedStudent.studentId);
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  }, [selectedStudent]);

  const fetchHistory = async (studentId: string) => {
    setIsLoadingHistory(true);
    try {
      const data = await attendanceService.getHistory(studentId);
      setHistory(data?.records || []);
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
      toast.error("Không thể tải lịch sử nghỉ học.");
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error("Vui lòng chọn học sinh trước.");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do nghỉ học.");
      return;
    }

    setIsSubmitting(true);

    const payload: AttendanceRequestDto = {
      studentId: selectedStudent.studentId,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
    };

    try {
      await attendanceService.submitLeave(payload);
      toast.success("Gửi đơn xin nghỉ thành công!");

      setStartDate("");
      setEndDate("");
      setReason("");
      fetchHistory(selectedStudent.studentId);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra khi gửi đơn.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 rounded-xl m-6 border-2 border-dashed border-gray-300">
        <div className="bg-yellow-100 p-4 rounded-full mb-4">
          <User size={48} className="text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">Chưa chọn học sinh</h3>
        <p className="text-gray-500 mt-2">
          Vui lòng chọn con em của bạn từ danh sách bên trái để tiếp tục.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FileText size={32} />
              </div>
              Đơn Xin Nghỉ Học
            </h1>
            <p className="text-gray-500 mt-2 ml-1">
              Quản lý và gửi đơn nghỉ phép cho học sinh{" "}
              <strong>{selectedStudent.fullName}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Send size={20} /> Tạo đơn mới
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Điền thông tin để gửi đơn xin nghỉ
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Từ ngày
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đến ngày
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate} // Chặn ngày kết thúc nhỏ hơn ngày bắt đầu
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lý do nghỉ
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none min-h-[120px]"
                    placeholder="Ví dụ: Cháu bị ốm sốt, gia đình có việc bận..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send size={20} /> Gửi đơn ngay
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <History className="text-blue-600" size={24} /> Lịch sử nghỉ
                  học
                </h2>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                  {history.length} bản ghi
                </span>
              </div>

              <div className="flex-1 p-6">
                {isLoadingHistory ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                    <Loader2 size={40} className="animate-spin text-blue-500" />
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 py-10">
                    <div className="bg-gray-50 p-6 rounded-full">
                      <Clock size={48} className="opacity-20" />
                    </div>
                    <p className="font-medium">Chưa có lịch sử nghỉ học nào.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((record) => (
                      <div
                        key={record.attendanceId}
                        className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-xl border border-red-100 group-hover:bg-red-100 transition-colors">
                              <Calendar className="text-red-500" size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-lg">
                                {formatDate(record.absentDate)}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                <Clock size={14} />
                                Ngày tạo: {formatDate(record.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100 self-start">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold">
                              Đã ghi nhận
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                          <AlertCircle
                            size={18}
                            className="text-orange-500 shrink-0 mt-0.5"
                          />
                          <div>
                            <span className="text-sm font-semibold text-gray-700 mr-2">
                              Lý do:
                            </span>
                            <span className="text-sm text-gray-600 italic">
                              "{record.reason}"
                            </span>
                          </div>
                        </div>

                        {record.notifiedBy && (
                          <div className="mt-2 pl-[30px] text-xs text-gray-400 flex items-center gap-1">
                            <User size={12} /> Người gửi: {record.notifiedBy}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
