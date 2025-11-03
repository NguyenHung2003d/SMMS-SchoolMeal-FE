"use client";

import { NavigationTabsProps } from "@/types";

export default function NavigationTabs({
  menuItems,
  activeTab,
  setActiveTab,
}: NavigationTabsProps) {
  return (
    <div className="bg-white border-b overflow-x-auto">
      <div className="flex space-x-1 px-6 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${activeTab === item.id ? item.color : ""}`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
