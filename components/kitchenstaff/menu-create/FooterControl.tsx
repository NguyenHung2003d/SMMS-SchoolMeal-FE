import React from "react";
import { Calendar, Save, Loader2 } from "lucide-react";

interface FooterControlProps {
  weekStart: string;
  weekEnd: string;
  submitting: boolean;
  onWeekStartChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function FooterControl({
  weekStart,
  weekEnd,
  submitting,
  onWeekStartChange,
  onSubmit,
}: FooterControlProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 md:pl-72 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-sm font-medium">Tuần bắt đầu (T2):</span>
            <input
              type="date"
              value={weekStart}
              onChange={onWeekStartChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Kết thúc (CN):</span>
            <input
              type="date"
              value={weekEnd}
              disabled
              className="border border-gray-200 bg-gray-100 text-gray-500 rounded px-2 py-1 text-sm cursor-not-allowed"
            />
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="px-8 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Lưu & Tạo Kế Hoạch
        </button>
      </div>
    </div>
  );
}
