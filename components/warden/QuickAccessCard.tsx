import React from "react";
import Link from "next/link";

interface QuickAccessCardProps {
  href: string;
  icon: React.ReactNode;
  bgClass: string;
  title: string;
  desc: string;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  href,
  icon,
  bgClass,
  title,
  desc,
}) => {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${bgClass} p-4 rounded-full mb-4`}>{icon}</div>
        <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </Link>
  );
};
