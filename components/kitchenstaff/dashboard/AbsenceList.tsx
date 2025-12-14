import React from "react";
import { CalendarX } from "lucide-react";
import { format } from "date-fns";
import { AbsenceRequestShortDto } from "@/types/kitchen-dashboard";
import { EmptyState } from "./EmptyState";

interface AbsenceListProps {
  requests: AbsenceRequestShortDto[];
}

export const AbsenceList = ({ requests }: AbsenceListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <CalendarX className="mr-2 text-blue-500" size={20} />
        Yêu cầu báo nghỉ mới nhất
      </h3>
      {requests.length === 0 ? (
        <EmptyState message="Không có học sinh báo nghỉ hôm nay." />
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {requests.map((req) => (
            <div
              key={req.attendanceId}
              className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-semibold text-gray-800 text-base">
                  {req.studentName}{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    - {req.className}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {req.reasonShort || "Không có lý do"}
                </p>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <span className="inline-block text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded mb-1">
                  Nghỉ ngày: {format(new Date(req.absentDate), "dd/MM")}
                </span>
                <p className="text-xs text-gray-400">
                  Báo bởi: {req.notifiedByName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
