'use client';
import React, { useState } from "react";
import {
  Settings,
  Calendar,
  DollarSign,
  Save,
  Info,
  Check,
  ChevronDown,
  Plus,
  Trash2,
  X,
  Edit,
} from "lucide-react";

const periodOptions = [
  { value: 1, label: "1 tháng" },
  { value: 3, label: "3 tháng" },
  { value: 6, label: "6 tháng" },
  { value: 12, label: "12 tháng" },
];

export default function ManagerPaymentSettings() {
  const [savedSettings, setSavedSettings] = useState({
    mode: "cycle",
    cycleSettings: {
      selectedPeriod: 3,
      fee: 750000,
    },
    milestoneSettings: {
      periods: [
        {
          id: 1,
          startDate: "2024-09-01",
          endDate: "2024-12-31",
          fee: 2250000,
        },
        {
          id: 2,
          startDate: "2025-02-01",
          endDate: "2025-05-31",
          fee: 2250000,
        },
      ],
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editPaymentMode, setEditPaymentMode] = useState(savedSettings.mode);
  const [editCycleSettings, setEditCycleSettings] = useState(
    savedSettings.cycleSettings
  );
  const [editMilestoneSettings, setEditMilestoneSettings] = useState(
    savedSettings.milestoneSettings
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditPaymentMode(savedSettings.mode);
    setEditCycleSettings(savedSettings.cycleSettings);
    setEditMilestoneSettings(savedSettings.milestoneSettings);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    setSavedSettings({
      mode: editPaymentMode,
      cycleSettings: editCycleSettings,
      milestoneSettings: editMilestoneSettings,
    });
    setShowSuccessMessage(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const addMilestonePeriod = () => {
    const newId =
      Math.max(...editMilestoneSettings.periods.map((p) => p.id), 0) + 1;
    setEditMilestoneSettings({
      periods: [
        ...editMilestoneSettings.periods,
        {
          id: newId,
          startDate: "",
          endDate: "",
          fee: 0,
        },
      ],
    });
  };

  const removeMilestonePeriod = (id: any) => {
    setEditMilestoneSettings({
      periods: editMilestoneSettings.periods.filter((p) => p.id !== id),
    });
  };

  const updateMilestonePeriod = (id: any, field: any, value: any) => {
    setEditMilestoneSettings({
      periods: editMilestoneSettings.periods.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: value,
            }
          : p
      ),
    });
  };

  const calculateMilestoneTotalFee = (periods: any) => {
    return periods.reduce((sum: any, period: any) => sum + period.fee, 0);
  };

  const getPeriodLabel = (value: any) => {
    return periodOptions.find((opt) => opt.value === value)?.label || "";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Cài đặt thanh toán tiền ăn
          </h1>
          <p className="text-gray-600">
            Cấu hình mức phí tiền ăn theo các khoảng thời gian
          </p>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <Check size={20} className="text-green-600 mr-3" />
          <p className="text-green-800">
            Cài đặt thanh toán đã được cập nhật thành công!
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
        <Info size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Hướng dẫn:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Chọn phương thức thu phí: theo chu kỳ hoặc theo mốc thời gian
            </li>
            <li>Thiết lập mức phí tiền ăn phù hợp với phương thức đã chọn</li>
            <li>
              Phụ huynh có thể chọn thanh toán theo khoảng thời gian phù hợp
            </li>
            <li>
              Các thay đổi sẽ được áp dụng cho tất cả phụ huynh sau khi lưu
            </li>
          </ul>
        </div>
      </div>

      {/* Display Current Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Settings size={20} className="mr-2 text-orange-500" />
              Cài đặt hiện tại
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Phương thức thanh toán đã được xuất bản
            </p>
          </div>
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center text-sm font-medium"
          >
            <Edit size={16} className="mr-2" />
            Chỉnh sửa
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3">
              Phương thức thu phí
            </h3>
            <p className="text-gray-700">
              {savedSettings.mode === "cycle"
                ? "Thu phí ăn trưa theo chu kỳ"
                : "Thu theo các mốc thời gian trong năm"}
            </p>
          </div>

          {savedSettings.mode === "cycle" ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4">
                Chi tiết chu kỳ thanh toán
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">
                    Chu kỳ thanh toán
                  </label>
                  <p className="text-gray-800 font-medium">
                    {getPeriodLabel(savedSettings.cycleSettings.selectedPeriod)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Mức phí</label>
                  <p className="text-gray-800 font-medium">
                    {formatCurrency(savedSettings.cycleSettings.fee)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Trung bình/tháng
                  </label>
                  <p className="text-gray-800 font-medium">
                    {formatCurrency(
                      Math.round(
                        savedSettings.cycleSettings.fee /
                          savedSettings.cycleSettings.selectedPeriod
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Các mốc thời gian</h3>
              {savedSettings.milestoneSettings.periods.map((period, index) => (
                <div
                  key={period.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h4 className="font-medium text-gray-800 mb-3">
                    Mốc thời gian {index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Ngày bắt đầu
                      </label>
                      <p className="text-gray-800 font-medium">
                        {period.startDate}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Ngày kết thúc
                      </label>
                      <p className="text-gray-800 font-medium">
                        {period.endDate}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Mức phí</label>
                      <p className="text-gray-800 font-medium">
                        {formatCurrency(period.fee)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="text-sm text-gray-600">Tổng mức phí</label>
                <p className="text-gray-800 font-bold text-lg">
                  {formatCurrency(
                    calculateMilestoneTotalFee(
                      savedSettings.milestoneSettings.periods
                    )
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">
                Chỉnh sửa cài đặt thanh toán
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Mode Selection */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Settings size={20} className="mr-2 text-orange-500" />
                  Phương thức thu phí
                </h3>
                <div className="relative">
                  <select
                    value={editPaymentMode}
                    onChange={(e) => setEditPaymentMode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
                  >
                    <option value="cycle">Thu phí ăn trưa theo chu kỳ</option>
                    <option value="milestone">
                      Thu theo các mốc thời gian trong năm
                    </option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Cycle-based Payment */}
              {editPaymentMode === "cycle" && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Calendar size={20} className="mr-2 text-orange-500" />
                    Cài đặt thu phí theo chu kỳ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn chu kỳ thanh toán
                      </label>
                      <div className="relative">
                        <select
                          value={editCycleSettings.selectedPeriod}
                          onChange={(e) =>
                            setEditCycleSettings({
                              ...editCycleSettings,
                              selectedPeriod: parseInt(e.target.value),
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
                        >
                          {periodOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mức phí
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={editCycleSettings.fee}
                          onChange={(e) =>
                            setEditCycleSettings({
                              ...editCycleSettings,
                              fee: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập mức phí"
                        />
                        <DollarSign
                          size={18}
                          className="absolute right-3 top-3 text-gray-400"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatCurrency(editCycleSettings.fee)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Chu kỳ đã chọn:</strong>{" "}
                      {editCycleSettings.selectedPeriod} tháng
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Mức phí:</strong>{" "}
                      {formatCurrency(editCycleSettings.fee)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Trung bình/tháng:</strong>{" "}
                      {formatCurrency(
                        Math.round(
                          editCycleSettings.fee /
                            editCycleSettings.selectedPeriod
                        )
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Milestone-based Payment */}
              {editPaymentMode === "milestone" && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Calendar size={20} className="mr-2 text-orange-500" />
                    Cài đặt thu phí theo mốc thời gian
                  </h3>
                  <div className="space-y-4">
                    {editMilestoneSettings.periods.map((period, index) => (
                      <div
                        key={period.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            Mốc thời gian {index + 1}
                          </h4>
                          {editMilestoneSettings.periods.length > 1 && (
                            <button
                              onClick={() => removeMilestonePeriod(period.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ngày bắt đầu
                            </label>
                            <input
                              type="date"
                              value={period.startDate}
                              onChange={(e) =>
                                updateMilestonePeriod(
                                  period.id,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ngày kết thúc
                            </label>
                            <input
                              type="date"
                              value={period.endDate}
                              onChange={(e) =>
                                updateMilestonePeriod(
                                  period.id,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mức phí
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={period.fee}
                                onChange={(e) =>
                                  updateMilestonePeriod(
                                    period.id,
                                    "fee",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mức phí"
                              />
                              <DollarSign
                                size={16}
                                className="absolute right-2 top-2.5 text-gray-400"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatCurrency(period.fee)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addMilestonePeriod}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"
                    >
                      <Plus size={20} className="mr-2" />
                      Thêm mốc thời gian
                    </button>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Số mốc thời gian:</strong>{" "}
                      {editMilestoneSettings.periods.length} mốc
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Tổng mức phí:</strong>{" "}
                      {formatCurrency(
                        calculateMilestoneTotalFee(
                          editMilestoneSettings.periods
                        )
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center text-sm font-medium"
              >
                <Save size={16} className="mr-2" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
