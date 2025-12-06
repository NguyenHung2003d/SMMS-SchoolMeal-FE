import React from "react";
import { InvoiceFilter } from "@/types/invoices";

interface InvoiceFiltersProps {
  filter: InvoiceFilter;
  setFilter: (filter: InvoiceFilter) => void;
}

export const InvoiceFilters = ({ filter, setFilter }: InvoiceFiltersProps) => {
  const handleChange = (key: keyof InvoiceFilter, value: any) => {
    setFilter({ ...filter, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          value={filter.year || ""}
          onChange={(e) => handleChange("year", Number(e.target.value))}
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          value={filter.monthNo || ""}
          onChange={(e) =>
            handleChange(
              "monthNo",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">Tất cả tháng</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:col-span-2"
          value={filter.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Unpaid">Chưa thanh toán</option>
          <option value="Paid">Đã thanh toán</option>
        </select>
      </div>
    </div>
  );
};
