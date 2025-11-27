import { Search } from "lucide-react";

interface ReportFilterBarProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onFilter: () => void;
  isFinance?: boolean;
}

export default function ReportFilterBar({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onFilter,
  isFinance = false,
}: ReportFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Từ ngày
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đến ngày
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      <button
        onClick={onFilter}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-sm h-[38px]"
      >
        <Search size={16} />
        Lọc báo cáo
      </button>
    </div>
  );
}
