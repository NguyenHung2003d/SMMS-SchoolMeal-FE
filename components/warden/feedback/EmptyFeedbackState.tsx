import React from "react";
import { AlertCircle } from "lucide-react";

export const EmptyFeedbackState = () => {
  return (
    <div className="p-12 text-center">
      <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">
        Không có báo cáo nào
      </h3>
    </div>
  );
};
