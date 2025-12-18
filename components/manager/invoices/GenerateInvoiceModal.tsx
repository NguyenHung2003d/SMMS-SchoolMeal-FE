"use client";
import React, { useState } from "react";
import {
  X,
  Loader2,
  CalendarPlus,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { GenerateInvoiceRequest } from "@/types/invoices";

interface GenerateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateInvoiceRequest) => Promise<any>;
  isSubmitting: boolean;
}

export const GenerateInvoiceModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: GenerateInvoiceModalProps) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [skipExisting, setSkipExisting] = useState(true);
  const years = [
    now.getFullYear() - 1,
    now.getFullYear(),
    now.getFullYear() + 1,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);

    const formatDate = (date: Date) => {
      const offset = date.getTimezoneOffset();
      date = new Date(date.getTime() - offset * 60 * 1000);
      return date.toISOString().split("T")[0];
    };

    const payload: GenerateInvoiceRequest = {
      dateFrom: formatDate(firstDay),
      dateTo: formatDate(lastDay),
      skipExisting: skipExisting,
    };

    await onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarPlus className="text-blue-600" size={24} />
            Tạo Hóa Đơn Hàng Loạt
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tháng
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Năm
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm border border-blue-100 flex gap-2 items-start">
              <span className="mt-0.5">ℹ️</span>
              <span>
                Hệ thống sẽ tạo hóa đơn từ ngày{" "}
                <span className="font-bold">
                  01/{selectedMonth}/{selectedYear}
                </span>{" "}
                đến hết ngày{" "}
                <span className="font-bold">
                  {new Date(selectedYear, selectedMonth, 0).getDate()}/
                  {selectedMonth}/{selectedYear}
                </span>
                .
              </span>
            </div>
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="skip"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={skipExisting}
                onChange={(e) => setSkipExisting(e.target.checked)}
              />
              <label
                htmlFor="skip"
                className="ml-2.5 text-sm text-gray-700 cursor-pointer select-none"
              >
                Bỏ qua học sinh đã có hóa đơn
              </label>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-blue-200 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                Xác nhận tạo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
