import React from "react";
import { X, Save, Loader2 } from "lucide-react";

interface MissingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingSlots: { day: number; meal: string; label: string }[];
  mealNotes: Record<string, string>;
  onNoteChange: (day: number, mealType: string, note: string) => void;
  onConfirm: () => void;
  submitting: boolean;
}

export default function MissingNotesModal({
  isOpen,
  onClose,
  missingSlots,
  mealNotes,
  onNoteChange,
  onConfirm,
  submitting,
}: MissingNotesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 bg-orange-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              ⚠️ Xác nhận ngày nghỉ (Bữa Trưa)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Các bữa trưa sau chưa có món. Vui lòng nhập lý do nghỉ (VD: Nghỉ
              lễ).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {missingSlots.map((slot, index) => {
            const key = `${slot.day}_${slot.meal}`;
            return (
              <div key={index} className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  {slot.label}
                </label>
                <input
                  type="text"
                  autoFocus={index === 0}
                  placeholder="VD: Nghỉ lễ, Tự túc, Họp hội đồng..."
                  value={mealNotes[key] || ""}
                  onChange={(e) =>
                    onNoteChange(slot.day, slot.meal, e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none w-full"
                />
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg text-sm"
          >
            Quay lại
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg shadow hover:bg-orange-700 text-sm flex items-center gap-2 disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Lưu tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
