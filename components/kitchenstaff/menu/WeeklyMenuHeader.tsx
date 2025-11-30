import React from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ScheduleMeal } from "@/types/kitchen-menu";

interface Props {
  currentSchedule: ScheduleMeal | undefined;
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}

export const WeeklyMenuHeader: React.FC<Props> = ({
  currentSchedule,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center">
        <div className="p-2 bg-orange-100 rounded-lg mr-3">
          <Calendar className="text-orange-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentSchedule
              ? `Thực đơn Tuần ${currentSchedule.weekNo} - Năm ${currentSchedule.yearNo}`
              : "Chưa có lịch thực đơn"}
          </h2>
          {currentSchedule && (
            <p className="text-sm text-gray-500">
              {format(parseISO(currentSchedule.weekStart), "dd/MM/yyyy")} -{" "}
              {format(parseISO(currentSchedule.weekEnd), "dd/MM/yyyy")}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          disabled={disableNext}
          className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};