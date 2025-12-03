import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers";
import { managerFinanceService } from "@/services/managerFinance.service";
import { PurchaseOrderDto } from "@/types/manager-finance";
import { Download, Eye, Printer, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PurchaseDetailModal from "../dashboard/PurchaseDetailModal";

interface ShoppingModalProps {
  orders: PurchaseOrderDto[];
  onClose: () => void;
  month: number;
  year: number;
}

export const ShoppingOrdersModal = ({
  orders,
  onClose,
  month,
  year,
}: ShoppingModalProps) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const handleExport = async () => {
    try {
      const blob = await managerFinanceService.exportPurchaseReport(
        month,
        year
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BaoCaoChiPhiDiCho_${month}_${year}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Xuất file thành công!");
    } catch {
      toast.error("Lỗi xuất file");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chi phí đi chợ
              </h2>
              <p className="text-sm text-gray-500">
                Tháng {month}/{year}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Printer size={32} className="text-gray-400" />
                </div>
                Không có đơn hàng nào trong tháng này.
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className="cursor-pointer group border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="mb-2 sm:mb-0">
                      <p className="font-bold text-gray-800 flex items-center gap-2">
                        Đơn hàng #{order.orderId}
                        {order.purchaseOrderStatus && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">
                            {order.purchaseOrderStatus}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ngày:{" "}
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm text-gray-500">
                        NCC:{" "}
                        <span className="font-medium text-gray-700">
                          {order.supplierName}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed">
                        <p className="text-lg font-bold text-orange-600">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {order.itemsCount
                            ? `${order.itemsCount} mặt hàng`
                            : "Chi tiết..."}
                        </p>
                      </div>
                      <div className="hidden sm:block text-gray-300 group-hover:text-blue-500 transition-colors">
                        <Eye size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-gray-50 text-right flex justify-end">
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              <Download size={16} /> Xuất Excel báo cáo
            </Button>
          </div>
        </div>
      </div>
      <PurchaseDetailModal
        orderId={selectedOrderId}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </>
  );
};
