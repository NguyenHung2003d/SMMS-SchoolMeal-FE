import React, { useState } from "react";
import { differenceInDays, format, parseISO } from "date-fns";
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
  Users,
  Utensils,
} from "lucide-react";
import { ManagerNotification } from "@/types/notification";

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

export const parseDate = (dateString: string) => {
  if (!dateString) return new Date();
  if (!dateString.endsWith("Z")) {
    return new Date(dateString + "Z");
  }
  return new Date(dateString);
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

export const getCategoryLabel = (type?: string) => {
  if (!type) return "Khác";

  const normalizedType = type.toLowerCase().trim();

  switch (normalizedType) {
    // 1. Nhóm Thức ăn
    case "food":
    case "kitchenstaff":
    case "meal":
      return "🍽️ Thức ăn";

    case "facility":
    case "facilitymanager":
      return "🏫 Cơ sở vật chất";

    case "health":
    case "medicalstaff":
      return "❤️ Sức khỏe";

    case "activity":
    case "activitymanager":
      return "🎨 Hoạt động";

    default:
      return "📋 Khác";
  }
};

export const getCategoryColor = (type?: string) => {
  if (!type) return "bg-gray-100 text-gray-700";

  const normalizedType = type.toLowerCase().trim();

  if (["food", "kitchenstaff", "meal"].includes(normalizedType))
    return "bg-orange-100 text-orange-700";

  if (["facility", "facilitymanager"].includes(normalizedType))
    return "bg-blue-100 text-blue-700";

  if (["health", "medicalstaff"].includes(normalizedType))
    return "bg-red-100 text-red-700";

  if (["activity", "activitymanager"].includes(normalizedType))
    return "bg-purple-100 text-purple-700";

  return "bg-gray-100 text-gray-700";
};

export const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-100 text-gray-700";
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "processing":
    case "inprogress":
      return "bg-blue-100 text-blue-700";
    case "resolved":
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusLabel = (status?: string) => {
  if (!status) return "Chờ xử lý";
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
      return "Chờ xử lý";
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

export const renderRecipientsInfo = (notif: ManagerNotification) => {
  const n = notif as any;
  const count = n.totalRecipients || n.TotalRecipients || 0;

  const sendToParents = n.sendToParents || n.SendToParents;
  const sendToTeachers = n.sendToTeachers || n.SendToTeachers;
  const sendToKitchenStaff = n.sendToKitchenStaff || n.SendToKitchenStaff;

  const groups = [];
  if (sendToParents) groups.push("Phụ huynh");
  if (sendToTeachers) groups.push("Giáo viên");
  if (sendToKitchenStaff) groups.push("Bếp");

  return (
    <div className="flex flex-col">
      <div className="flex items-center font-semibold text-gray-800">
        <Users size={16} className="mr-1.5 text-blue-500" />
        <span>{count} người</span>
      </div>

      <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-1">
        {groups.length > 0 ? (
          groups.map((g, i) => (
            <span
              key={i}
              className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
            >
              {g}
            </span>
          ))
        ) : (
          <span className="italic">Chưa gửi</span>
        )}
      </div>
    </div>
  );
};

export const formatDate = (dateString?: string | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

export const formatQuantity = (gram: number) => {
  if (gram >= 1000) return `${(gram / 1000).toFixed(2)} kg`;
  return `${gram} g`;
};

export const getExpiryStatus = (dateStr?: string) => {
  if (!dateStr)
    return { label: "Không có HSD", color: "text-gray-500", bg: "bg-gray-100" };

  const daysLeft = differenceInDays(parseISO(dateStr), new Date());

  if (daysLeft < 0)
    return { label: "Đã hết hạn", color: "text-red-600", bg: "bg-red-100" };
  if (daysLeft <= 3)
    return {
      label: `Còn ${daysLeft} ngày`,
      color: "text-orange-600",
      bg: "bg-orange-100",
    };
  return {
    label: format(parseISO(dateStr), "dd/MM/yyyy"),
    color: "text-gray-600",
    bg: "bg-transparent",
  };
};
