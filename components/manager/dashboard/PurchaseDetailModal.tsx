"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, Package, User, FileText } from "lucide-react";
import { formatCurrency } from "@/helpers"; 
import { managerPurchasesService } from "@/services/managerPurchases.service";

interface ModalProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseDetailModal({
  orderId,
  isOpen,
  onClose,
}: ModalProps) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const result = await managerPurchasesService.getPurchaseOrderDetail(
            orderId
          );
          setData(result);
        } catch (error) {
          console.error("Lỗi lấy chi tiết:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setData(null);
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            Chi tiết đơn hàng #{orderId}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                    <User size={18} /> Nhà cung cấp
                  </div>
                  <p className="text-gray-800">{data.supplierName}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2 text-orange-700 font-semibold">
                    <FileText size={18} /> Ghi chú
                  </div>
                  <p className="text-gray-800 italic">
                    {data.note || "Không có"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package size={18} /> Danh sách nguyên liệu
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-medium">
                      <tr>
                        <th className="px-4 py-3">Tên hàng</th>
                        <th className="px-4 py-3 text-right">SL (kg)</th>
                        <th className="px-4 py-3 text-right">Đơn giá</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.lines?.map((item: any) => (
                        <tr key={item.lineId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {item.ingredientName}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.quantityGram}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-800">
                            {formatCurrency(item.quantityGram * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-right font-bold"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-blue-600 text-base">
                          {formatCurrency(data.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Không tìm thấy dữ liệu.
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
