import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { DayMenuDto, WeekMenuDto } from "@/types/menu";

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