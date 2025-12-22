import React, { useRef, useState } from "react";
import { Truck, AlertTriangle, ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    supplierName: string,
    note: string,
    billImage: File | null
  ) => void;
}

export default function ConfirmOrderModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmOrderModalProps) {
  const [supplierName, setSupplierName] = useState("");
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirm = () => {
    if (!supplierName.trim()) {
      toast.error("Vui lòng nhập tên nhà cung cấp");
      return;
    }
    onConfirm(supplierName, note, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex items-center gap-3 text-green-600 mb-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <Truck size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Tạo Đơn Hàng</h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg mb-4 text-sm text-yellow-800 flex gap-2">
          <AlertTriangle className="shrink-0" size={18} />
          <p>
            Hành động này sẽ tạo một đơn hàng mới trong hệ thống dựa trên kế
            hoạch hiện tại.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nhà cung cấp *
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="VD: Siêu thị BigC..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ảnh hóa đơn đi chợ
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                previewUrl
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {previewUrl ? (
                <div className="relative w-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="text-gray-400 mb-2" size={32} />
                  <span className="text-xs text-gray-500 text-center">
                    Nhấn để tải lên ảnh bill (JPG, PNG)
                  </span>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ghi chú
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none h-20 resize-none transition-all"
              placeholder="Ghi chú thêm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all"
          >
            Xác nhận tạo đơn
          </button>
        </div>
      </div>
    </div>
  );
}
