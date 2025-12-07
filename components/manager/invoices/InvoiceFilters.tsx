import React from "react";
import { InvoiceFilter } from "@/types/invoices";
import { Calendar, Filter, ChevronDown, CheckCircle2, X } from "lucide-react";

interface InvoiceFiltersProps {
  filter: InvoiceFilter;
  setFilter: (filter: InvoiceFilter) => void;
}

export const InvoiceFilters = ({ filter, setFilter }: InvoiceFiltersProps) => {
  const handleChange = (key: keyof InvoiceFilter, value: any) => {
    setFilter({ ...filter, [key]: value });
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <div className="hidden md:block">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            Bộ lọc hóa đơn
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-[140px_200px] gap-3 w-full md:w-auto">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
              <Calendar size={18} />
            </div>
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 block pl-10 pr-8 py-2.5 outline-none transition-all cursor-pointer hover:bg-white hover:border-gray-300"
              value={filter.year || ""}
              onChange={(e) => handleChange("year", Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="relative group col-span-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
              <CheckCircle2 size={18} />
            </div>
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 block pl-10 pr-8 py-2.5 outline-none transition-all cursor-pointer hover:bg-white hover:border-gray-300"
              value={filter.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Unpaid" className="text-yellow-600">
                ⏳ Chưa thanh toán
              </option>
              <option value="Paid" className="text-green-600">
                ✓ Đã thanh toán
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
