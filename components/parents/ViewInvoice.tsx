"use client";
import { SectionProps } from "@/types";
import React from "react";

export default function ViewInvoice({ selectedChild }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Xem hóa đơn</h2>

      {!selectedChild ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium mb-2">Chọn tháng</label>
            <select className="w-full border rounded-lg px-4 py-2">
              <option>Tháng 9/2025</option>
              <option>Tháng 8/2025</option>
              <option>Tháng 7/2025</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-yellow-600 text-white p-4">
              <h3 className="font-semibold">Hóa đơn tháng 9/2025</h3>
              <p className="text-sm opacity-90">
                Học sinh: {selectedChild.name}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Gói đăng ký</span>
                <span className="font-semibold">Gói đầy đủ</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số ngày ăn</span>
                <span className="font-semibold">18/20 ngày</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Đơn giá/ngày</span>
                <span className="font-semibold">60,000 VNĐ</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">
                  Số tiền ghi có (nghỉ phép)
                </span>
                <span className="font-semibold text-green-600">
                  -120,000 VNĐ
                </span>
              </div>

              <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
                <span className="font-bold text-lg">Tổng cộng</span>
                <span className="font-bold text-lg text-blue-600">
                  1,080,000 VNĐ
                </span>
              </div>

              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Đã thanh toán
                </span>
              </div>

              <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                Tải hóa đơn PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
