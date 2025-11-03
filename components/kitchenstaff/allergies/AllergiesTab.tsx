"use client";

import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { allergyAlerts, dietaryRestrictions } from "@/data";
import AllergyTable from "./AllergyTable";
import AddAllergyModal from "./AddAllergyModal";
import AsideRight from "./AsideRight";

export default function AllergiesTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý dị ứng</h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} className="mr-2" />
          <span>Thêm dị ứng mới</span>
        </button>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayAlerts />
          <AllergyTable />
          <DietaryRestrictions />
        </div>
        <AsideRight />
      </div>

      {isAddModalOpen && (
        <AddAllergyModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}

function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <p className="text-sm text-gray-500 mb-1">Học sinh có dị ứng</p>
        <h3 className="text-3xl font-bold text-gray-800">4</h3>
        <p className="mt-2 text-sm text-gray-600">Trên tổng số 75 học sinh</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <p className="text-sm text-gray-500 mb-1">Cảnh báo hôm nay</p>
        <h3 className="text-3xl font-bold text-gray-800">2</h3>
        <p className="mt-2 text-sm text-gray-600">Cần xử lý cho bữa trưa</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
        <p className="text-sm text-gray-500 mb-1">Chế độ ăn đặc biệt</p>
        <h3 className="text-3xl font-bold text-gray-800">2</h3>
        <p className="mt-2 text-sm text-gray-600">Ăn kiêng và ăn chay</p>
      </div>
    </div>
  );
}

function TodayAlerts() {
  const today = "24/10/2023";
  const todayAlerts = allergyAlerts.filter((a) => a.date === today);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <AlertTriangle className="mr-2 text-orange-500" size={20} />
        <h2 className="text-lg font-medium">Cảnh báo dị ứng hôm nay</h2>
      </div>
      <div className="p-4">
        {todayAlerts.length === 0 ? (
          <p className="text-gray-500 text-center">Không có cảnh báo hôm nay</p>
        ) : (
          todayAlerts.map((alert) => (
            <div key={alert.id} className="p-4 mb-4 bg-red-50 rounded-lg">
              <p className="font-medium">{alert.student}</p>
              <p className="text-sm text-gray-500">
                Dị ứng: {alert.allergies.join(", ")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DietaryRestrictions() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Chế độ ăn đặc biệt</h2>
      </div>
      <div className="p-4 space-y-3">
        {dietaryRestrictions.map((r) => (
          <div key={r.id} className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">{r.student}</p>
            <p className="text-sm text-gray-600">{r.restriction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
