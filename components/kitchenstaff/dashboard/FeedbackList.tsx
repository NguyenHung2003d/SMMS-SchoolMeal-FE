import React from "react";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { FeedbackShortDto } from "@/types/kitchen-dashboard";
import { EmptyState } from "./EmptyState";

interface FeedbackListProps {
  feedbacks: FeedbackShortDto[];
}

export const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <MessageSquare className="mr-2 text-green-500" size={20} />
          Phản hồi gần đây
        </h3>
      </div>

      {feedbacks.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[200px]">
          <EmptyState message="Chưa có phản hồi nào." />
        </div>
      ) : (
        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {feedbacks.map((fb) => (
            <div
              key={fb.feedbackId}
              className="relative pl-6 border-l-2 border-gray-200 hover:border-green-400 transition-colors group"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-green-400 transition-colors"></div>
              <div className="mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-green-600 transition-colors">
                  {fb.mealType} - {format(new Date(fb.mealDate), "dd/MM")}
                </span>
              </div>
              <p className="text-gray-800 font-medium italic mb-2 line-clamp-3">
                "{fb.contentPreview}"
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-600 font-medium">
                  {fb.senderName}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(fb.createdAt), "HH:mm")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
