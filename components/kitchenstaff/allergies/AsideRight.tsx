"use client";

import { AlertCircle, Calendar, FileText } from "lucide-react";
import { allergyAlerts, commonAllergens } from "@/data";

export default function AsideRight() {
  return (
    <div className="space-y-6">
      <CommonAllergens />
      <UpcomingAlerts />
      <Resources />
    </div>
  );
}

function CommonAllergens() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <AlertCircle className="mr-2 text-red-500" size={20} />
        <h2 className="text-lg font-medium">Dị ứng phổ biến</h2>
      </div>
      <div className="p-4 space-y-3">
        {commonAllergens.map((a, idx) => (
          <div key={idx} className="mb-3 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{a.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  a.count > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {a.count} học sinh
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  a.count > 0 ? "bg-red-500" : "bg-gray-300"
                }`}
                style={{ width: `${Math.max(5, (a.count / 4) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingAlerts() {
  const today = "24/10/2023";
  const upcoming = allergyAlerts.filter((a) => a.date !== today);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Calendar className="mr-2 text-blue-500" size={20} />
        <h2 className="text-lg font-medium">Cảnh báo sắp tới</h2>
      </div>
      <div className="p-4 space-y-3">
        {upcoming.map((alert) => (
          <div
            key={alert.id}
            className="border border-gray-200 rounded-lg p-3 mb-3 last:mb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{alert.student}</p>
                <p className="text-xs text-gray-500">Lớp {alert.class}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.status === "high"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {alert.status === "high" ? "Mức độ cao" : "Mức độ trung bình"}
              </span>
            </div>
            <p className="text-sm text-red-600">
              Dị ứng: {alert.allergies.join(", ")}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {alert.date} - {alert.dish}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Resources() {
  const docs = [
    {
      title: "Hướng dẫn xử lý dị ứng thực phẩm",
      size: "PDF - 2.3MB",
    },
    {
      title: "Danh sách thay thế thực phẩm",
      size: "PDF - 1.5MB",
    },
    {
      title: "Quy trình khẩn cấp khi xảy ra dị ứng",
      size: "PDF - 1.1MB",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <FileText className="mr-2 text-blue-500" size={20} />
        <h2 className="text-lg font-medium">Tài liệu hướng dẫn</h2>
      </div>
      <ul className="p-4 space-y-3">
        {docs.map((doc, idx) => (
          <li key={idx}>
            <a
              href="#"
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="bg-blue-100 p-2 rounded mr-3">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-500">{doc.size}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
