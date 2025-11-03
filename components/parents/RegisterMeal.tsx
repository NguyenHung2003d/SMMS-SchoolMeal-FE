"use client";
import { RegisterMealProps } from "@/types";
import React from "react";

export default function RegisterMeal({ selectedChild }: RegisterMealProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Đăng ký suất ăn</h2>
      {!selectedChild ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">
              Học sinh: {selectedChild.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Gói đăng ký
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="package" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-semibold">
                        Gói đầy đủ - 1,200,000 VNĐ/tháng
                      </p>
                      <p className="text-sm text-gray-600">
                        Bao gồm: Sáng, Trưa, Chiều (20 ngày)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Xác nhận và thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
