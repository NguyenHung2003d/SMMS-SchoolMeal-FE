"use client";

import React, { useState } from "react";
import { Menu, X, Bell, User } from "lucide-react";
import { Child } from "@/types";
import RegisterMealSection from "./RegisterMeal";
import UpdateProfileSection from "./UpdateProfile";
import TrackBMISection from "./TrackBMI";
import ViewInvoiceSection from "./ViewInvoice";
import LeaveApplicationSection from "./LeaveApplication";
import { children, menuItems } from "@/data";
import MenuAndFeedback from "./MenuAndFeedback";

const ParentDashboard: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<string>("register");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const renderContent = () => {
    switch (activeTab) {
      case "register":
        return <RegisterMealSection selectedChild={selectedChild} />;
      case "profile":
        return <UpdateProfileSection selectedChild={selectedChild} />;
      case "health":
        return <TrackBMISection selectedChild={selectedChild} />;
      case "menu_and_feedback":
        return <MenuAndFeedback selectedChild={selectedChild} />;
      case "invoice":
        return <ViewInvoiceSection selectedChild={selectedChild} />;
      case "leave":
        return <LeaveApplicationSection selectedChild={selectedChild} />;
      default:
        return <RegisterMealSection selectedChild={selectedChild} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
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
            {children.map((child) => {
              const IconAvatar = child.avatar ?? User;
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
                    <IconAvatar className="w-7 h-7 text-gray-700" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {child.name}
                      </p>
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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Parent Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Quản lý bữa ăn học đường
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  PH
                </div>
                <div>
                  <p className="font-semibold text-sm">Phụ huynh</p>
                  <p className="text-xs text-gray-600">parent@email.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b overflow-x-auto">
          <div className="flex space-x-1 px-6 py-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeTab === item.id ? item.color : ""
                  }`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
