import React, { useState } from "react";
import { differenceInDays, format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  ChefHat,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  School,
  User,
  UserPlus,
  Users,
  Utensils,
} from "lucide-react";
import { ManagerNotification } from "@/types/notification";
import axios from "axios";

export const formatNumber = (num: number) => {
  return num?.toLocaleString("vi-VN");
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

export const getCategoryLabel = (type?: string) => {
  if (!type) return "Khác";

  const normalizedType = type.toLowerCase().trim();

  switch (normalizedType) {
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

export const getInitials = (name: string) => {
  if (!name) return "MN";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const renderRecipientsInfo = (item: ManagerNotification) => {
  if (!item.targetRoles || item.targetRoles.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Users size={16} />
        <span className="text-sm">{item.totalRecipients} người nhận</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {item.targetRoles.includes("Parent") && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium">
            <Users size={11} /> Phụ huynh
          </div>
        )}

        {(item.targetRoles.includes("Warden") ||
          item.targetRoles.includes("Teacher")) && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium">
            <GraduationCap size={11} /> Giáo viên
          </div>
        )}

        {item.targetRoles.includes("KitchenStaff") && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium">
            <ChefHat size={11} /> Nhà bếp
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <span>
          Tổng cộng:{" "}
          <span className="font-semibold text-gray-700">
            {item.totalRecipients}
          </span>{" "}
          người
        </span>
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

export const StudentAvatar = ({
  src,
  alt,
  gender,
}: {
  src?: string;
  alt: string;
  gender?: string;
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || "");
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt
  )}&background=random&color=fff`;

  const displaySrc = hasError || !imgSrc ? fallbackSrc : imgSrc;

  return (
    <div className="h-12 w-12 rounded-full overflow-hidden mr-4 ring-2 ring-orange-100 bg-gray-100">
      <img
        src={displaySrc}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)} // Quan trọng: Bắt lỗi khi ảnh die
      />
    </div>
  );
};

export const getNormalizedCategory = (type: string | undefined | null) => {
  const t = (type || "").toLowerCase();
  if (t.includes("kitchen") || t.includes("food") || t.includes("meal"))
    return "food";
  if (t.includes("facility") || t.includes("repair")) return "facility";
  if (t.includes("health") || t.includes("medical")) return "health";
  if (t.includes("activity") || t.includes("event")) return "activity";
  return "other";
};

export const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="flex items-center gap-2 px-2">
    <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
    <input
      type="date"
      className="text-sm border border-gray-300 rounded-md px-2 py-1.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all bg-gray-50 hover:bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const formatMonth = (dateString: string | Date) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(2);
  return `T${month}/${year}`;
};

export const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
          Đã nhập kho
        </span>
      );
    case "rejected":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">
          Đã từ chối
        </span>
      );
    case "draft":
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
          Chờ duyệt
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
          {status}
        </span>
      );
  }
};

export const formatQuantity = (gram: number) => {
  if (gram >= 1000) return `${(gram / 1000).toFixed(2)} kg`;
  return `${gram} g`;
};

export const DAY_MAP: Record<number, string> = {
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
  8: "Chủ Nhật",
};

export const getAxiosErrorMessage = (
  err: unknown,
  fallback: string = "Đã xảy ra lỗi"
): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data && typeof data === "object") {
      if (typeof (data as any).title === "string") {
        return (data as any).title;
      }

      if ((data as any).errors) {
        const errors = (data as any).errors;
        const messages = Object.values(errors).flat().filter(Boolean);

        if (messages.length > 0) {
          return messages.join(", ");
        }
      }
    }

    if (err.message) {
      return err.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

export const MEAL_MAP: Record<string, string> = {
  Lunch: "Bữa Trưa",
  SideDish: "Bữa Phụ",
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
