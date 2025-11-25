import React from "react";

interface StatsCardProps {
  value: number;
  label: string;
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  colorClass = "bg-orange-400",
}) => {
  return (
    <div className={`${colorClass} text-white rounded-lg p-6 shadow-sm`}>
      <div className="flex flex-col items-center">
        <h3 className="text-4xl font-bold mb-2">{value}</h3>
        <p className="text-sm text-center">{label}</p>
      </div>
    </div>
  );
};
