"use client";
import { formatDateForInput } from "@/helpers";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  AttendanceRequestDto,
  AttendanceResponseDto,
  SelectIconProps,
} from "@/types/parent";

import {
  AlertCircle,
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LeaveApplication: React.FC<SelectIconProps> = ({ selectedChild }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [history, setHistory] = useState<AttendanceResponseDto[]>([]);

  useEffect(() => {
    if (selectedChild?.studentId) {
      fetchHistory(selectedChild?.studentId);
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  }, [selectedChild]);

  const fetchHistory = async (studentId: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await axiosInstance.get<any>(
        `/Attendance/student/${studentId}`,
        { params: { _t: new Date().getTime() } }
      );

      const rawData = response && response.data ? response.data : response;

      let finalHistory: AttendanceResponseDto[] = [];

      if (rawData?.records && Array.isArray(rawData.records)) {
        finalHistory = rawData.records;
      } else if (Array.isArray(rawData)) {
        finalHistory = rawData;
      }
      setHistory(finalHistory);
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
      return;
    }

    setIsSubmitting(true);

    const payload: AttendanceRequestDto = {
      studentId: selectedChild.studentId,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
    };
    try {
      await axiosInstance.post("/Attendance", payload);
      toast.success("Gửi đơn xin nghỉ thành công!");
      setStartDate("");
      setEndDate("");
      setReason("");
      await fetchHistory(selectedChild.studentId);
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Calendar className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Đơn xin nghỉ
            </h1>
          </div>
        </div>

        {!selectedChild ? (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-8 flex items-center gap-4 shadow-md animate-pulse">
            <div className="p-3 bg-yellow-200 rounded-lg">
              <AlertCircle className="text-yellow-700" size={32} />
            </div>
            <div>
              <p className="text-yellow-800 font-bold text-lg">
                Vui lòng chọn học sinh
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Chọn học sinh từ danh sách bên trái để tạo đơn xin nghỉ
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 sticky top-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Tạo đơn mới
                  </h2>
                  <p className="text-pink-100 mt-2 text-base md:text-lg">
                    cho <span className="font-bold">{selectedChild.name}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-sm md:text-base font-bold mb-3 text-gray-700">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all hover:border-orange-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-bold mb-3 text-gray-700">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all hover:border-orange-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm md:text-base font-bold mb-3 text-gray-700">
                      Lý do nghỉ (tùy chọn)
                    </label>
                    <textarea
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 md:py-4 text-base md:text-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all resize-none hover:border-orange-300"
                      rows={5}
                      placeholder="Ví dụ: Bé bị sốt, gia đình có việc bận..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 md:p-5">
                    <p className="flex gap-3 text-blue-800 text-sm md:text-base">
                      <AlertCircle
                        size={24}
                        className="shrink-0 text-blue-600 mt-0.5"
                      />
                      <span>
                        <strong className="text-blue-900">Lưu ý:</strong> Số
                        tiền hoàn trả (nếu có) sẽ được tính toán dựa trên quy
                        định của nhà trường.
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 md:py-5 rounded-xl font-bold text-base md:text-lg hover:from-orange-700 hover:to-amber-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={24} />
                        <span>Gửi đơn xin nghỉ</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 md:p-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="text-white" size={32} />
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Lịch sử đơn nghỉ
                    </h3>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-white bg-white/20 px-4 md:px-5 py-2 md:py-3 rounded-xl backdrop-blur-sm">
                    {history?.length || 0}
                  </span>
                </div>

                <div className="p-6 md:p-8 min-h-[400px]">
                  {isLoadingHistory ? (
                    <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                      <Loader2
                        size={48}
                        className="animate-spin mb-4 text-pink-500"
                      />
                      <p className="text-lg md:text-xl">Đang tải dữ liệu...</p>
                    </div>
                  ) : !Array.isArray(history) || history.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                      <Calendar size={48} className="mx-auto mb-3 opacity-40" />
                      <p className="text-lg md:text-xl font-medium">
                        Chưa có lịch sử nghỉ học nào.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {history.map((item) => (
                        <div
                          key={item.attendanceId}
                          className="border-2 border-gray-100 rounded-xl p-5 md:p-6 hover:border-pink-300 hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-white group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="text-blue-500" size={20} />
                              <p className="font-bold text-gray-800 text-lg">
                                {formatDateForInput(item.absentDate)}
                              </p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              Đã ghi nhận
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 mb-3">
                            Ngày tạo:{" "}
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-gray-700 flex gap-2">
                              <span className="font-bold">Lý do:</span>
                              <span>{item.reason || "Không có lý do"}</span>
                            </p>

                            {item.notifiedBy && (
                              <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                                <User size={14} /> Người báo: {item.notifiedBy}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplication;
