import React from "react";

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