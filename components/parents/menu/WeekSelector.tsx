import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WeekSelectorProps } from "@/types/parent";

export default function WeekSelector({
  availableWeeks,
  selectedDateInWeek,
  onSelectDate,
}: WeekSelectorProps) {
  if (availableWeeks.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500 text-sm">
        Chưa có lịch thực đơn nào.
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-2">
          {availableWeeks.map((week) => {
            const isSelected = selectedDateInWeek === week.weekStart;
            return (
              <button
                key={week.scheduleMealId || week.ScheduleMealId}
                onClick={() => onSelectDate(week.weekStart)}
                className={`
                                group flex flex-col items-center justify-center px-5 py-2 rounded-lg transition-all duration-200 border
                                ${
                                  isSelected
                                    ? "bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-200"
                                    : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600"
                                }
                            `}
              >
                <span
                  className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${
                    isSelected
                      ? "text-orange-100"
                      : "text-gray-400 group-hover:text-orange-400"
                  }`}
                >
                  Tuần
                </span>
                <span className="font-bold text-lg leading-none">
                  {week.weekNo}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
