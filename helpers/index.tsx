import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  School,
  User,
  UserPlus,
  Utensils,
} from "lucide-react";

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

export const getIconComponent = (iconName: any) => {
  const icons = {
    School: <School size={16} />,
    Utensils: <Utensils size={16} />,
    FileText: <FileText size={16} />,
    User: <User size={16} />,
    UserPlus: <UserPlus size={16} />,
    DollarSign: <DollarSign size={16} />,
    AlertCircle: <AlertCircle size={16} />,
    Bell: <Bell size={16} />,
  };
  return <Activity size={16} />;
};

export const formatGrowth = (growth: number) => {
  if (growth === 0) return "0% so với tháng trước";
  const sign = growth > 0 ? "+" : "";
  return `${sign}${growth}% so với tháng trước`;
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

export const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));

export const getBMIStatusColor = (category?: string | null) => {
  const cat = category?.toLowerCase();
  switch (cat) {
    case "underweight":
      return "bg-blue-100 text-blue-800";
    case "normal":
      return "bg-green-100 text-green-800";
    case "overweight":
      return "bg-yellow-100 text-yellow-800";
    case "obese":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getBMIStatusText = (category?: string | null) => {
  const cat = category?.toLowerCase();
  switch (cat) {
    case "underweight":
      return "Thiếu cân";
    case "normal":
      return "Bình thường";
    case "overweight":
      return "Thừa cân";
    case "obese":
      return "Béo phì";
    default:
      return "Chưa có dữ liệu";
  }
};

export const getCategoryLabel = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
      return "Thức ăn";
    case "facility":
      return "Cơ sở vật chất";
    case "health":
      return "Sức khỏe";
    case "activity":
      return "Hoạt động";
    default:
      return "Khác";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
      return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200";
    case "facility":
      return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200";
    case "health":
      return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200";
    case "activity":
      return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200";
    default:
      return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Chờ xử lý";
    case "processing":
    case "inprogress":
      return "Đang xử lý";
    case "resolved":
    case "completed":
      return "Đã giải quyết";
    default:
      return "Không xác định";
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30";
    case "processing":
    case "inprogress":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30";
    case "resolved":
    case "completed":
      return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  }
};

export const getInitials = (name: string) => {
  if (!name) return "MN";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getSendTypeInfo = (type: string) => {
  if (type === "Immediate" || type === "Tức thời") {
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "🚨 Tức thời",
      icon: CheckCircle2,
    };
  }
  return {
    bg: "bg-blue-50",
    text: "text-blue-700",
    label: "📅 Định kỳ",
    icon: Clock,
  };
};
