"use client";
import { SectionProps } from "@/types";
import React from "react";

const LeaveApplication: React.FC<SectionProps> = ({ selectedChild }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Đơn xin nghỉ</h2>

      {!selectedChild ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vui lòng chọn học sinh từ danh sách bên trái
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="font-semibold">
              Tạo đơn xin nghỉ cho {selectedChild.name}
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ngày bắt đầu nghỉ
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ngày kết thúc nghỉ
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Lý do nghỉ (tùy chọn)
              </label>
              <textarea
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
                placeholder="Nhập lý do..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Số tiền hoàn trả sẽ được ghi có vào hóa
                đơn tháng kế tiếp. Đơn xin nghỉ phải được gửi trước thời gian
                quy định (cutoff time).
              </p>
            </div>

            <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700">
              Gửi đơn xin nghỉ
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Lịch sử đơn xin nghỉ</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">15/09/2025 - 16/09/2025</p>
                    <p className="text-sm text-gray-600">Lý do: Ốm</p>
                    <p className="text-sm text-green-600 mt-1">
                      Số tiền hoàn: 120,000 VNĐ
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Đã duyệt
                  </span>
                </div>
              </div>
              {/* Có thể map thêm lịch sử tại đây */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;
