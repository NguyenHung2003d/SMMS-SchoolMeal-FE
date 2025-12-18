import React from "react";
import { InvoiceFilter } from "@/types/invoices";
import {
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { ClassDTO } from "@/types/manager";

interface InvoiceFiltersProps {
  filter: InvoiceFilter;
  setFilter: React.Dispatch<React.SetStateAction<InvoiceFilter>>;
  classes: ClassDTO[];
  isLoadingClasses?: boolean;
}

export const InvoiceFilters = ({
  filter,
  setFilter,
  classes,
  isLoadingClasses,
}: InvoiceFiltersProps) => {
  const handleChange = (key: keyof InvoiceFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
      <div className="flex flex-col gap-5">
        {/* Header chỉ còn tiêu đề */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 shrink-0">
            <Filter size={18} className="text-orange-600" />
            Bộ lọc tìm kiếm
          </h3>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
              <Calendar size={18} />
            </div>
            <select
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              value={filter.monthNo || ""}
              onChange={(e) =>
                handleChange(
                  "monthNo",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            >
              <option value="">-- Chọn Tháng --</option>
              {months.map((m) => (
                <option value={m} key={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
              <Calendar size={18} />
            </div>
            <select
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              value={filter.year || ""}
              onChange={(e) => handleChange("year", Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
              <GraduationCap size={18} />
            </div>
            <select
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none cursor-pointer hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={filter.classId || ""}
              onChange={(e) => handleChange("classId", e.target.value)}
              disabled={isLoadingClasses}
            >
              <option value="">
                {isLoadingClasses ? "Đang tải lớp..." : "-- Tất cả lớp --"}
              </option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* 4. Chọn Trạng thái */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors">
              <CheckCircle2 size={18} />
            </div>
            <select
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              value={filter.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Unpaid">⏳ Chưa thanh toán</option>
              <option value="Paid">✓ Đã thanh toán</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
