"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import InventoryStats from "./InventoryStats";
import InventoryTable from "./InventoryTable";
import OrdersTable from "./OrdersTable";
import ExpiryAlerts from "./ExpiryAlerts";
import AddInventoryModal from "./AddInventoryModal";
import { expiryAlerts, inventoryItems, upcomingOrders } from "@/data";

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kho nguyên liệu
        </h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} className="mr-2" /> Thêm nguyên liệu
        </button>
      </div>

      <InventoryStats
        items={inventoryItems}
        orders={upcomingOrders}
        alerts={expiryAlerts}
      />

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <nav className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "inventory"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Kho nguyên liệu
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Đơn đặt hàng
          </button>
        </nav>
      </div>

      {activeTab === "inventory" ? (
        <InventoryTable items={inventoryItems} />
      ) : (
        <OrdersTable orders={upcomingOrders} />
      )}

      <ExpiryAlerts alerts={expiryAlerts} />

      {isAddModalOpen && (
        <AddInventoryModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
