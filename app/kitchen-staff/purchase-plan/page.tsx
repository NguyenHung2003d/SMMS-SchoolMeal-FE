"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { PurchasePlan } from "@/types/kitchen-purchasePlan";

import { kitchenPurchasePlanService } from "@/services/kitchenStaff/kitchenPurchasePlan.service";
import { kitchenPurchaseOrderService } from "@/services/kitchenStaff/kitchenPurchaseOrder.service";

import EmptyPlanState from "@/components/kitchenstaff/purchase-plan/EmptyPlanState";
import PurchasePlanHeader from "@/components/kitchenstaff/purchase-plan/PurchasePlanHeader";
import PurchasePlanStats from "@/components/kitchenstaff/purchase-plan/PurchasePlanStats";
import PurchasePlanTable from "@/components/kitchenstaff/purchase-plan/PurchasePlanTable";
import PurchasePlanFooter from "@/components/kitchenstaff/purchase-plan/PurchasePlanFooter";
import AddItemModal from "@/components/kitchenstaff/purchase-plan/AddItemModal";
import ConfirmOrderModal from "@/components/kitchenstaff/purchase-plan/ConfirmOrderModal";
import { useRouter } from "next/navigation";

export default function KitchenStaffPurchasePlanPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PurchasePlan | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const router = useRouter();

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchPlanByDate(selectedDate);
  }, [selectedDate]);

  const fetchPlanByDate = async (dateStr: string) => {
    setLoading(true);
    try {
      const data = await kitchenPurchasePlanService.getPlanByDate(dateStr);
      setPlan(data);
    } catch (error: any) {
      setPlan(null);
      if (error?.response?.status === 404) {
        const dateDisplay = new Date(dateStr).toLocaleDateString("vi-VN");
        toast.error(`Chưa có kế hoạch nào cho ngày ${dateDisplay}`, {
          id: "plan-404",
        });
      } else {
        console.error("Lỗi tải plan:", error);
        toast.error("Lỗi hệ thống: Không thể tải dữ liệu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLine = (index: number, field: string, value: string) => {
    if (!plan) return;
    const newLines = [...plan.lines];
    if (field === "actualPrice") {
      const val = parseFloat(value) || 0;
      newLines[index].actualPrice = val;
      newLines[index].status = val > 0 ? "Purchased" : "Pending";
    } else if (field === "batchNo") {
      newLines[index].batchNo = value;
    } else if (field === "origin") {
      newLines[index].origin = value;
    }
    setPlan({ ...plan, lines: newLines });
  };

  const handleDeleteLine = (index: number) => {
    if (!plan || plan.planStatus === "Confirmed") return;
    const newLines = plan.lines.filter((_, i) => i !== index);
    setPlan({ ...plan, lines: newLines });
    toast.success("Đã xóa dòng (Vui lòng Lưu nháp để cập nhật)");
  };

  const handleAddItem = (newItem: {
    name: string;
    quantity: number;
    ingredientId: number;
    type?: string;
  }) => {
    if (!plan) return;

    const existingItemIndex = plan.lines.findIndex(
      (l) => l.ingredientId === newItem.ingredientId
    );

    if (existingItemIndex !== -1) {
      const newLines = [...plan.lines];
      const existingLine = newLines[existingItemIndex];

      existingLine.rqQuanityGram += newItem.quantity;

      setPlan({ ...plan, lines: newLines });
      setIsAddItemModalOpen(false);
      toast.success(`Đã cộng thêm ${newItem.quantity} vào ${newItem.name}`);
      return;
    }

    const newLine: any = {
      ingredientId: newItem.ingredientId,
      ingredientName: newItem.name,
      rqQuanityGram: newItem.quantity,
      actualPrice: 0,
      status: "Pending",
      batchNo: "",
      origin: "",
      category: newItem.type || "Thêm thủ công",
    };

    setPlan({ ...plan, lines: [...plan.lines, newLine] });
    setIsAddItemModalOpen(false);
    toast.success("Đã thêm mặt hàng mới");
  };

  const handleSaveDraft = async () => {
    if (!plan) return;
    const payload = {
      planId: plan.planId,
      planStatus: "Draft",
      lines: plan.lines,
    };
    toast.promise(kitchenPurchasePlanService.updatePlan(plan.planId, payload), {
      loading: "Đang lưu nháp...",
      success: "Đã lưu nháp thành công!",
      error: "Lỗi khi lưu dữ liệu.",
    });
  };

  const handleOpenConfirm = () => {
    if (!plan) return;
    const zeroPriceItems = plan.lines.filter(
      (i) => !i.actualPrice || i.actualPrice === 0
    );
    if (zeroPriceItems.length > 0) {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <span className="font-medium text-gray-800">
              ⚠️ Cảnh báo: Có {zeroPriceItems.length} mặt hàng chưa nhập giá.
            </span>
            <div className="flex gap-2 mt-2 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={() => toast.dismiss(t.id)}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                onClick={() => {
                  toast.dismiss(t.id);
                  setIsConfirmModalOpen(true);
                }}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        ),
        { duration: 5000, icon: "✋" }
      );
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmOrder = async (
    supplierName: string,
    note: string,
    billImage: File | null
  ) => {
    if (!plan) return;
    const formData = new FormData();
    formData.append("PlanId", plan.planId.toString());
    formData.append("SupplierName", supplierName);
    formData.append("Note", note);

    if (billImage) {
      formData.append("BillImage", billImage);
    }
    plan.lines.forEach((l, index) => {
      formData.append(
        `Lines[${index}].IngredientId`,
        l.ingredientId.toString()
      );
      formData.append(
        `Lines[${index}].QuantityOverrideGram`,
        l.rqQuanityGram.toString()
      );
      formData.append(
        `Lines[${index}].UnitPrice`,
        (l.actualPrice || 0).toString()
      );
      formData.append(`Lines[${index}].BatchNo`, l.batchNo || "");
      formData.append(`Lines[${index}].Origin`, l.origin || "");
    });
    await toast.promise(kitchenPurchaseOrderService.createFromPlan(formData), {
      loading: "Đang tạo đơn hàng...",
      success: () => {
        setIsConfirmModalOpen(false);

        setTimeout(() => {
          router.push("/kitchen-staff/purchase-history");
        }, 1000);

        return "Đã tạo đơn hàng thành công! Đang chuyển hướng...";
      },
      error: (err) => err?.response?.data?.error || "Có lỗi xảy ra.",
    });
  };

  const handleDeletePlan = async () => {
    if (!plan || !confirm("Bạn có chắc chắn muốn xóa kế hoạch này không?"))
      return;
    await toast.promise(kitchenPurchasePlanService.deletePlan(plan.planId), {
      loading: "Đang xóa...",
      success: () => {
        setPlan(null);
        return "Đã xóa kế hoạch";
      },
      error: (err: any) => {
        return "Lỗi khi xóa" + err.message;
      },
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-2 text-orange-500" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );

  if (!plan) {
    return (
      <EmptyPlanState
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    );
  }

  const isPlanDraft = plan.planStatus === "Draft";
  const totalActual = plan.lines.reduce(
    (sum, item) => sum + (item.actualPrice || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative pb-32">
      <PurchasePlanHeader
        status={plan.planStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDraft={isPlanDraft}
        onDeletePlan={handleDeletePlan}
        onOpenAddModal={() => setIsAddItemModalOpen(true)}
      />

      <PurchasePlanStats
        totalCost={totalActual}
        totalItems={plan.lines.length}
      />

      <PurchasePlanTable
        lines={plan.lines}
        isDraft={isPlanDraft}
        onUpdateLine={handleUpdateLine}
        onDeleteLine={handleDeleteLine}
      />

      {isPlanDraft && (
        <PurchasePlanFooter
          onSaveDraft={handleSaveDraft}
          onConfirm={handleOpenConfirm}
        />
      )}

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAdd={handleAddItem}
      />

      <ConfirmOrderModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
}
