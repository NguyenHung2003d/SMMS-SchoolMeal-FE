"use client";
import { useState } from "react";
import { Printer, Download, Plus } from "lucide-react";
import {
  previousLists,
  replacementSuggestions,
  shoppingItems,
} from "@/data";
import StatsOverview from "./StatsOverview";
import CurrentShoppingList from "./CurrentShoppingList";
import PreviousShoppingLists from "./PreviousShoppingLists";
import AddItemModal from "./AddItemModal";
import ReplacementModal from "./ReplacementModal";

export function PurchasePlan() {
  const [activeTab, setActiveTab] = useState("current");
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const totalEstimatedCost = shoppingItems.reduce(
    (sum, i) => (i.status !== "purchased" ? sum + i.estimatedCost : sum),
    0
  );
  const pendingCount = shoppingItems.filter(
    (i) => i.status === "pending"
  ).length;
  const purchasedCount = shoppingItems.filter(
    (i) => i.status === "purchased"
  ).length;
  const outOfStockCount = shoppingItems.filter(
    (i) => i.status === "outOfStock"
  ).length;

  const handleStatusChange = (id: number, status: string) => {
    console.log("Update", id, status);
    if (status === "outOfStock") {
      const item = shoppingItems.find((i) => i.id === id);
      if (item) {
        setSelectedItem(item);
        setIsReplacementModalOpen(true);
      }
    }
  };
  const handleReplacement = (itemId: number, replacementId: number) => {
    console.log("Replace", itemId, "with", replacementId);
    setIsReplacementModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kế hoạch mua sắm</h1>
        <div className="flex space-x-3">
          <button className="border px-4 py-2 rounded flex items-center">
            <Printer size={18} className="mr-2" /> In danh sách
          </button>
          <button className="border px-4 py-2 rounded flex items-center">
            <Download size={18} className="mr-2" /> Xuất Excel
          </button>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={18} className="mr-2" /> Thêm mặt hàng
          </button>
        </div>
      </div>

      <StatsOverview
        totalEstimatedCost={totalEstimatedCost}
        pendingCount={pendingCount}
        purchasedCount={purchasedCount}
        outOfStockCount={outOfStockCount}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <nav className="flex border-b">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-4 ${
              activeTab === "current"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Danh sách hiện tại
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-6 py-4 ${
              activeTab === "previous"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Danh sách trước đây
          </button>
        </nav>
      </div>

      {activeTab === "current" && (
        <CurrentShoppingList
          shoppingItems={shoppingItems}
          handleStatusChange={handleStatusChange}
          setSelectedItem={setSelectedItem}
          setIsReplacementModalOpen={setIsReplacementModalOpen}
        />
      )}

      {activeTab === "previous" && (
        <PreviousShoppingLists previousLists={previousLists} />
      )}

      {isAddItemModalOpen && (
        <AddItemModal setIsAddItemModalOpen={setIsAddItemModalOpen} />
      )}
      {isReplacementModalOpen && selectedItem && (
        <ReplacementModal
          selectedItem={selectedItem}
          replacementSuggestions={replacementSuggestions}
          setIsReplacementModalOpen={setIsReplacementModalOpen}
          setIsAddItemModalOpen={setIsAddItemModalOpen}
          handleReplacement={handleReplacement}
        />
      )}
    </div>
  );
}
