import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  subText: string;
  highlight?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  subText,
  highlight = false,
}: StatCardProps) => {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border ${
        highlight ? "border-red-200 ring-2 ring-red-50" : "border-gray-100"
      } hover:shadow-md transition-shadow relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 my-1">{value}</h3>
          <p className="text-xs text-gray-500">{subText}</p>
        </div>
        <div
          className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
