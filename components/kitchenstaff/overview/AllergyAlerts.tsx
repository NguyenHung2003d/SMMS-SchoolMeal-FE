"use client";

import { allergyAlerts } from "@/data";
import { AlertCircle, ChevronRight } from "lucide-react";

export default function AllergyAlerts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold">Cảnh báo dị ứng</h2>
      </div>
      <div className="p-4">
        {allergyAlerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 ${
              index !== allergyAlerts.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <AlertCircle size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="font-medium">{alert.student}</p>
                  <p className="text-sm text-gray-500">Lớp {alert.class}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-orange-500">
                {alert.meal}
              </span>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">Món ăn: {alert.dish}</p>
              <p className="text-red-500">
                Dị ứng: {alert.allergies.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button className="w-full py-2 text-orange-500 hover:text-orange-600 font-medium flex items-center justify-center">
          <span>Xem tất cả cảnh báo</span>
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
