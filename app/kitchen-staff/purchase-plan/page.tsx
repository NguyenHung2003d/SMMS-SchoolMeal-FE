"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Check,
  Download,
  Printer,
  AlertCircle,
  DollarSign,
  Truck,
  Loader2,
  Calendar,
  Save,
} from "lucide-react";
import { PurchasePlan } from "@/types/kitchen-purchasePlan";
import { kitchenPurchasePlanService } from "@/services/kitchenStaff/kitchenPurchasePlan.service";
import toast from "react-hot-toast"; // 1. Import toast

export default function KitchenStaffPurchasePlanPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PurchasePlan | null>(null);
  const [error, setError] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const [supplierName, setSupplierName] = useState("");
  const [note, setNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCurrentPlan(selectedDate);
  }, [selectedDate]);

  const fetchCurrentPlan = async (dateStr: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await kitchenPurchasePlanService.getCurrentPlan(dateStr);
      setPlan(data);
    } catch (error) {
      console.error("Lỗi tải plan:", error);
      setPlan(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEstimatedPriceChange = (index: number, value: string) => {
    if (!plan) return;
    const newLines = [...plan.lines];
    newLines[index].estimatedPrice = parseFloat(value) || 0;
    setPlan({ ...plan, lines: newLines });
  };

  const handleActualPriceChange = (index: number, value: string) => {
    if (!plan) return;
    const newLines = [...plan.lines];
    const val = parseFloat(value) || 0;
    newLines[index].actualPrice = val;

    if (val > 0) {
      newLines[index].status = "Purchased";
    }
    setPlan({ ...plan, lines: newLines });
  };

  const handleBatchNoChange = (index: number, value: string) => {
    if (!plan) return;
    const newLines = [...plan.lines];
    newLines[index].batchNo = value;
    setPlan({ ...plan, lines: newLines });
  };

  const handleOriginChange = (index: number, value: string) => {
    if (!plan) return;
    const newLines = [...plan.lines];
    newLines[index].origin = value;
    setPlan({ ...plan, lines: newLines });
  };

  const calculateTotals = () => {
    if (!plan) return { estimated: 0, actual: 0 };
    const estimated = plan.lines.reduce(
      (sum, item) => sum + item.estimatedPrice * item.rqQuanityGram,
      0
    );
    const actual = plan.lines.reduce(
      (sum, item) => sum + (item.actualPrice || 0) * item.rqQuanityGram,
      0
    );
    return { estimated, actual };
  };

  const handleSaveDraft = async () => {
    if (!plan) return;

    toast.promise(
      kitchenPurchasePlanService.updatePlan(plan.planId, {
        planId: plan.planId,
        planStatus: "Draft",
        lines: plan.lines,
      }),
      {
        loading: "Đang lưu nháp...",
        success: "Đã lưu nháp thành công!",
        error: "Lỗi khi lưu dữ liệu. Vui lòng thử lại.",
      }
    );
  };

  const handleOpenCompleteModal = () => {
    if (!plan) return;
    const zeroPriceItems = plan.lines.filter(
      (i) => !i.actualPrice || i.actualPrice === 0
    );

    if (zeroPriceItems.length > 0) {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <span className="font-medium text-gray-800">
              ⚠️ Cảnh báo: Có {zeroPriceItems.length} mặt hàng chưa nhập giá
              thực tế.
            </span>
            <span className="text-sm text-gray-500">
              Bạn có chắc chắn muốn tiếp tục không?
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
                  setIsCompleteModalOpen(true);
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

    setIsCompleteModalOpen(true);
  };

  const handleSubmitOrder = async () => {
    if (!plan) return;

    if (!supplierName.trim()) {
      toast.error("Vui lòng nhập tên nhà cung cấp");
      return;
    }

    const payload = {
      planId: plan.planId,
      supplierName: supplierName,
      note: note,
      lines: plan.lines.map((l) => ({
        ingredientId: l.ingredientId,
        quantityOverrideGram: l.rqQuanityGram,
        unitPrice: l.actualPrice || 0,
        batchNo: l.batchNo,
        origin: l.origin,
      })),
    };

    await toast.promise(
      kitchenPurchasePlanService.createPurchaseOrder(payload),
      {
        loading: "Đang tạo đơn hàng & cập nhật kho...",
        success: (data) => {
          setIsCompleteModalOpen(false);
          setTimeout(() => fetchCurrentPlan(selectedDate), 1000);
          return "Đã hoàn tất! Đơn hàng đã được tạo.";
        },
        error: (err) => {
          console.error(err);
          return (
            err?.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng."
          );
        },
      }
    );
  };

  const totals = calculateTotals();

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-2 text-orange-500" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-orange-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy kế hoạch
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            Không có kế hoạch nào cho ngày{" "}
            <strong>
              {new Date(selectedDate).toLocaleDateString("vi-VN")}
            </strong>
            .
          </p>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
              Chọn ngày khác:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Kế hoạch mua sắm
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {plan.planStatus === "Confirmed"
                ? "✅ Đã hoàn thành"
                : "⏳ Đang thực hiện"}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            onClick={() => setIsAddItemModalOpen(true)}
          >
            <Plus size={18} /> Thêm mặt hàng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Chi phí dự kiến
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {new Intl.NumberFormat("vi-VN").format(totals.estimated)}{" "}
            <span className="text-sm font-normal text-gray-500">vnđ</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Chi phí thực tế
          </div>
          <div
            className={`text-3xl font-bold ${
              totals.actual > totals.estimated
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {new Intl.NumberFormat("vi-VN").format(totals.actual)}{" "}
            <span className="text-sm font-normal text-gray-500">vnđ</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-700">Danh sách nguyên liệu</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-4 py-3 text-left w-1/4">Tên mặt hàng</th>
                <th className="px-4 py-3 text-center">SL (g)</th>

                <th className="px-4 py-3 text-right bg-blue-50/50">
                  Giá dự kiến
                </th>

                <th className="px-4 py-3 text-right bg-green-50/50 text-green-700">
                  Giá nhập (VNĐ)
                </th>

                <th className="px-4 py-3 text-left">Số lô (Batch)</th>
                <th className="px-4 py-3 text-left">Xuất xứ</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {plan.lines
                .filter((item) =>
                  item.ingredientName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {item.ingredientName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.category || "Nguyên liệu"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700 bg-gray-50/30">
                      {item.rqQuanityGram}
                    </td>

                    <td className="px-4 py-3 text-right bg-blue-50/20">
                      <input
                        type="number"
                        disabled={plan.planStatus === "Confirmed"}
                        className="w-28 text-right bg-transparent border border-transparent hover:border-blue-300 focus:border-blue-500 rounded px-2 py-1 outline-none transition-all focus:bg-white"
                        value={item.estimatedPrice || ""}
                        placeholder="0"
                        onChange={(e) =>
                          handleEstimatedPriceChange(index, e.target.value)
                        }
                      />
                    </td>

                    <td className="px-4 py-3 text-right bg-green-50/20">
                      <input
                        type="number"
                        disabled={plan.planStatus === "Confirmed"}
                        className="w-28 text-right font-bold text-green-700 bg-transparent border border-transparent hover:border-green-300 focus:border-green-500 rounded px-2 py-1 outline-none transition-all focus:bg-white placeholder-green-200"
                        value={item.actualPrice || ""}
                        placeholder="Nhập giá..."
                        onChange={(e) =>
                          handleActualPriceChange(index, e.target.value)
                        }
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        disabled={plan.planStatus === "Confirmed"}
                        className="w-full text-left bg-transparent border border-gray-200 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none focus:bg-white"
                        placeholder="---"
                        value={item.batchNo || ""}
                        onChange={(e) =>
                          handleBatchNoChange(index, e.target.value)
                        }
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        disabled={plan.planStatus === "Confirmed"}
                        className="w-full text-left bg-transparent border border-gray-200 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none focus:bg-white"
                        placeholder="VN..."
                        value={item.origin || ""}
                        onChange={(e) =>
                          handleOriginChange(index, e.target.value)
                        }
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          item.status === "Purchased"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {item.status === "Purchased" ? "Đã nhập" : "Chờ"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {plan.lines.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Chưa có nguyên liệu nào trong danh sách.
          </div>
        )}
      </div>

      {plan.planStatus !== "Confirmed" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 flex justify-end gap-3 md:pr-10 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center mr-auto text-sm text-gray-500 ml-4">
            <Save size={16} className="mr-1.5 text-orange-500" />
            <span>Thay đổi chưa được lưu vào lịch sử</span>
          </div>
          <button
            onClick={handleSaveDraft}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Lưu nháp
          </button>
          <button
            onClick={handleOpenCompleteModal}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2"
          >
            <Check size={20} /> Hoàn tất & Nhập kho
          </button>
        </div>
      )}

      {isCompleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Truck size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Xác nhận nhập kho
              </h2>
            </div>

            <p className="text-gray-500 text-sm mb-6 ml-1">
              Hệ thống sẽ tạo <strong>Purchase Order</strong> và cập nhật số
              lượng vào kho. <br />
              Hành động này không thể hoàn tác.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full border border-gray-300 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                    placeholder="VD: Siêu thị BigC, Chợ đầu mối..."
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    autoFocus
                  />
                  <Truck className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ghi chú
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none h-24 resize-none transition-all"
                  placeholder="Ghi chú thêm về đơn hàng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsCompleteModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmitOrder}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all"
              >
                Xác nhận nhập kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
