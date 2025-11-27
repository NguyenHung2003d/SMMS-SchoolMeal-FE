"use client";
import React from "react";
import { X, Ruler, Weight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthRecord, HealthFormData } from "@/types/warden-health";

interface UpdateHealthModalProps {
  open: boolean;
  student: HealthRecord | null;
  formData: HealthFormData;
  setFormData: (data: HealthFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UpdateHealthModal: React.FC<UpdateHealthModalProps> = ({
  open,
  student,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-800">Cập nhật sức khỏe</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Học sinh:</p>
            <p className="text-lg font-bold text-gray-800">
              {student.studentName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Chiều cao (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={formData.heightCm}
                  onChange={(e) =>
                    setFormData({ ...formData, heightCm: e.target.value })
                  }
                />
                <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Cân nặng (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={formData.weightKg}
                  onChange={(e) =>
                    setFormData({ ...formData, weightKg: e.target.value })
                  }
                />
                <Weight className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Ngày đo
            </label>
            <input
              type="date"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={formData.recordDate}
              onChange={(e) =>
                setFormData({ ...formData, recordDate: e.target.value })
              }
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Hủy bỏ
            </button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Save size={16} /> Lưu thông tin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
