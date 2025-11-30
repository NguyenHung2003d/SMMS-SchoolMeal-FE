import React from "react";

interface StatusBadgeProps {
  type: string;
}

export const StatusBadge = ({ type }: StatusBadgeProps) => {
  if (type === "Expired")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Hết hạn
      </span>
    );
  if (type === "NearExpiry")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        Sắp hết hạn
      </span>
    );
  if (type === "LowStock")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Sắp hết hàng
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {type}
    </span>
  );
};
