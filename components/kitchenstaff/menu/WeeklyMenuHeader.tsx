import React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { WeeklyScheduleDto } from "@/types/kitchen-menu";

interface Props {
  currentSchedule:
    | WeeklyScheduleDto
    | Pick<WeeklyScheduleDto, "weekStart" | "weekEnd" | "weekNo" | "yearNo">;
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
  const startDate =
    typeof currentSchedule.weekStart === "string"
      ? parseISO(currentSchedule.weekStart)
      : currentSchedule.weekStart;

  const endDate =
    typeof currentSchedule.weekEnd === "string"
      ? parseISO(currentSchedule.weekEnd)
      : currentSchedule.weekEnd;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center">
        <div className="p-3 bg-orange-100 rounded-xl mr-4 shadow-sm">
          <Calendar className="text-orange-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentSchedule.weekNo > 0
              ? `Thực đơn Tuần ${currentSchedule.weekNo} - Năm ${currentSchedule.yearNo}`
              : `Tuần từ ${format(startDate, "dd/MM")} đến ${format(
                  endDate,
                  "dd/MM"
                )}`}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
          </p>
        </div>
      </div>

      <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className="p-2 text-gray-600 hover:bg-white hover:shadow-sm hover:text-orange-600 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Tuần trước"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="w-[1px] bg-gray-200 my-1"></div>
        <button
          onClick={onNext}
          disabled={disableNext}
          className="p-2 text-gray-600 hover:bg-white hover:shadow-sm hover:text-orange-600 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Tuần sau"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
