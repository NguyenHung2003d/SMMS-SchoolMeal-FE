import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekSelectorProps } from "@/types/parent";

export default function WeekSelector({
  availableWeeks,
  selectedDateInWeek,
  onSelectDate,
}: WeekSelectorProps) {
  if (availableWeeks.length === 0) {
    return <p className="text-gray-500 italic">Chưa có lịch thực đơn.</p>;
  }

  return (
    <Tabs
      value={selectedDateInWeek}
      onValueChange={onSelectDate}
    >
      <TabsList className="w-full justify-start overflow-x-auto bg-white border p-1 h-auto scrollbar-hide">
        {availableWeeks.map((week) => (
          <TabsTrigger
            key={week.scheduleMealId || week.ScheduleMealId}
            value={week.weekStart}
            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 px-3 py-1.5 text-sm whitespace-nowrap"
          >
            Tuần {week.weekNo}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}