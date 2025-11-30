import React from "react";
import { Calendar, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getCategoryColor,
  getCategoryLabel,
  getStatusColor,
  getStatusLabel,
} from "@/helpers";
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
    <div className="p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
              {issue.title}
            </h3>

            <span
              className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(
                issue.targetType || ""
              )} backdrop-blur-sm`}
            >
              {getCategoryLabel(issue.targetType || "")}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {issue.content}
          </p>

          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
              <Calendar size={14} className="mr-1.5 text-orange-500" />
              <span className="font-medium">
                {format(new Date(issue.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </span>
            </div>

            {issue.targetRef && (
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                <span className="font-medium text-blue-700">
                  🎯 {issue.targetRef}
                </span>
              </div>
            )}

            <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-lg">
              <span className="font-medium text-purple-700">
                👤 {issue.senderName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end ml-4 gap-2">
          <span
            className={`px-4 py-2 text-xs font-semibold rounded-xl ${getStatusColor(
              issue.status || "pending"
            )}`}
          >
            {getStatusLabel(issue.status || "pending")}
          </span>
          <div className="flex space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(issue)}
              className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
              title="Chỉnh sửa"
            >
              <Edit size={18} />
            </button>

            <button
              onClick={() => onDelete(issue.feedbackId)}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
              title="Xóa"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
