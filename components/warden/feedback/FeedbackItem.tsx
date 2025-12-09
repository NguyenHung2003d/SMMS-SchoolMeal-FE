import React from "react";
import { Calendar, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getCategoryColor, getCategoryLabel } from "@/helpers";
import { FeedbackDto } from "@/types/warden-feedback";

interface FeedbackItemProps {
  issue: FeedbackDto;
  onEdit: (issue: FeedbackDto) => void;
  onDelete: (id: number) => void;
}

export const FeedbackItem = ({
  issue,
  onEdit,
  onDelete,
}: FeedbackItemProps) => {
  return (
    <div className="p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent transition-all duration-300 group border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-center">
        <div className="flex-1 pr-4">
          <div className="flex items-center mb-2 flex-wrap gap-2">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
              {issue.title}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                issue.targetType || ""
              )} backdrop-blur-sm`}
            >
              {getCategoryLabel(issue.targetType || "")}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
            {issue.content}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center bg-gray-100 px-2.5 py-1 rounded-md">
              <Calendar size={14} className="mr-1.5 text-orange-500" />
              <span className="font-medium">
                {format(new Date(issue.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </span>
            </div>

            {issue.targetRef && (
              <div className="flex items-center bg-blue-50 px-2.5 py-1 rounded-md text-blue-700 font-medium">
                🎯 {issue.targetRef}
              </div>
            )}

            <div className="flex items-center bg-purple-50 px-2.5 py-1 rounded-md text-purple-700 font-medium">
              👤 {issue.senderName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(issue)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors shadow-sm border border-transparent hover:border-blue-100"
            title="Chỉnh sửa"
          >
            <Edit size={20} />
          </button>

          <button
            onClick={() => onDelete(issue.feedbackId)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm border border-transparent hover:border-red-100"
            title="Xóa"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
