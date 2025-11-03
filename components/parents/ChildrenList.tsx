"use client";
import { ChildrenListProps } from "@/types";
import { User, X } from "lucide-react";

export default function ChildrenList({
  children,
  selectedChild,
  setSelectedChild,
  sidebarOpen,
  setSidebarOpen,
}: ChildrenListProps) {
  return (
    <div
      className={`${
        sidebarOpen ? "w-80" : "w-0"
      } bg-white shadow-lg transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Danh sách con</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {children.map((child) =>  {
            const AvatarIcon = child.avatar || User;
            return (
              <div
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedChild?.id === child.id
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <AvatarIcon className="w-7 h-7" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{child.name}</p>
                    <p className="text-sm text-gray-600">Lớp {child.class}</p>
                    {child.allergies.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Dị ứng: {child.allergies.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
