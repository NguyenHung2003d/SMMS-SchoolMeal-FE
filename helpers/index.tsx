import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Cookies from "js-cookie";

export function AllergyPill({
  label,
  selected,
  onClick,
  color,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  color: string;
}) {
  const baseClass =
    "px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all border-2";
  const selectedClass =
    color === "yellow"
      ? "bg-yellow-100 border-yellow-500 text-yellow-800"
      : "bg-red-100 border-red-500 text-red-800";
  const unselectedClass =
    color === "yellow"
      ? "bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-50"
      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${selected ? selectedClass : unselectedClass}`}
    >
      {label}
    </button>
  );
}

export const formatNumber = (num: number) => {
  return num?.toLocaleString("vi-VN");
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const calculateManualBMI = () => {
  const [manualHeight, setManualHeight] = useState("");
  const [manualWeight, setManualWeight] = useState("");
  const [manualBMI, setManualBMI] = useState<string | null>(null);

  if (manualHeight && manualWeight) {
    const h = parseFloat(manualHeight) / 100;
    const bmi = (parseFloat(manualWeight) / (h * h)).toFixed(1);
    setManualBMI(bmi);
  }
};

export const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return { text: "Thiếu cân", color: "text-yellow-600" };
  if (bmi < 25) return { text: "Bình thường", color: "text-green-600" };
  if (bmi < 30) return { text: "Thừa cân", color: "text-orange-600" };
  return { text: "Béo phì", color: "text-red-600" };
};

export const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return "Đang tính...";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  if (dateString.length === 10) return dateString;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};
export const getDayName = (dateString: string) => {
  try {
    return format(parseISO(dateString), "EEEE", { locale: vi });
  } catch {
    return "";
  }
};

export const renderStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "đã duyệt":
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <CheckCircle2 size={12} /> Đã duyệt
        </span>
      );
    case "rejected":
    case "từ chối":
      return (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertCircle size={12} /> Từ chối
        </span>
      );
    default:
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Clock size={12} /> Chờ duyệt
        </span>
      );
  }
};

export const getRoleInfo = (role: string) => {
  const r = role?.toLowerCase() || "";
  if (r.includes("teacher") || r.includes("giáo viên"))
    return { text: "Giáo viên", className: "bg-blue-100 text-blue-800" };
  if (r.includes("kitchenstaff") || r.includes("kitchen"))
    return { text: "Nhân viên bếp", className: "bg-green-100 text-green-800" };
  if (r.includes("warden") || r.includes("quản sinh"))
    return { text: "Quản sinh", className: "bg-purple-100 text-purple-800" };
  if (r.includes("manager"))
    return { text: "Quản lý", className: "bg-red-100 text-red-800" };
  return { text: role, className: "bg-gray-100 text-gray-800" };
};

export const getStatusInfo = (status: string) => {
  const s = status.toLowerCase();
  if (s === "paid" || s === "đã thanh toán")
    return { text: "Đã thanh toán", className: "bg-green-100 text-green-800" };
  if (s === "pending" || s === "chờ thanh toán")
    return {
      text: "Chờ thanh toán",
      className: "bg-yellow-100 text-yellow-800",
    };
  if (s === "overdue" || s === "quá hạn")
    return { text: "Quá hạn", className: "bg-red-100 text-red-800" };
  return { text: status, className: "bg-gray-100 text-gray-800" };
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }));