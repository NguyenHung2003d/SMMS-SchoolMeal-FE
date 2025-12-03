"use client";
import {
  CreateSchoolDto,
  SchoolDTO,
  UpdateSchoolDto,
} from "@/types/admin-school";
import {
  X,
  FileText,
  DollarSign,
  Calendar,
  Paperclip,
  FileCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    schoolData: CreateSchoolDto | UpdateSchoolDto,
    contractData?: any
  ) => Promise<void>;
  initialData?: SchoolDTO | null;
  isSubmitting: boolean;
}

export default function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: SchoolFormModalProps) {
  const [schoolData, setSchoolData] = useState<CreateSchoolDto>({
    schoolName: "",
    contactEmail: "",
    hotline: "",
    schoolAddress: "",
    isActive: true,
  });

  const [contractData, setContractData] = useState({
    hasContract: false,
    contractCode: "",
    revenueAmount: 0,
    revenueDate: new Date().toISOString().split("T")[0],
    contractNote: "",
    contractFile: null as File | null,
  });

  useEffect(() => {
    if (initialData) {
      setSchoolData({
        schoolName: initialData.schoolName,
        contactEmail: initialData.contactEmail || "",
        hotline: initialData.hotline || "",
        schoolAddress: initialData.schoolAddress || "",
        isActive: initialData.isActive,
      });
      setContractData((prev) => ({ ...prev, hasContract: false }));
    } else {
      setSchoolData({
        schoolName: "",
        contactEmail: "",
        hotline: "",
        schoolAddress: "",
        isActive: true,
      });
      setContractData({
        hasContract: false,
        contractCode: "",
        revenueAmount: 0,
        revenueDate: new Date().toISOString().split("T")[0],
        contractNote: "",
        contractFile: null,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(schoolData, contractData.hasContract ? contractData : undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractData({ ...contractData, contractFile: e.target.files[0] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b shrink-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Cập nhật thông tin trường" : "Thêm trường học mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form id="school-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-l-4 border-orange-500 pl-2">
                Thông tin chung
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trường <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={schoolData.schoolName}
                  onChange={(e) =>
                    setSchoolData({ ...schoolData, schoolName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Nhập tên trường học..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={schoolData.contactEmail}
                    onChange={(e) =>
                      setSchoolData({
                        ...schoolData,
                        contactEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotline (Số đt quản lý)
                  </label>
                  <input
                    type="text"
                    value={schoolData.hotline}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, hotline: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Nhập số chưa đăng ký..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Số điện thoại này sẽ được dùng để tạo tài khoản Admin
                    trường.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={schoolData.schoolAddress}
                  onChange={(e) =>
                    setSchoolData({
                      ...schoolData,
                      schoolAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={schoolData.isActive}
                  onChange={(e) =>
                    setSchoolData({ ...schoolData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-gray-700 font-medium cursor-pointer"
                >
                  Kích hoạt hoạt động ngay
                </label>
              </div>
            </div>

            {!initialData && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 border-l-4 border-blue-500 pl-2">
                    Thông tin hợp đồng (Tùy chọn)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <input
                      id="hasContract"
                      type="checkbox"
                      checked={contractData.hasContract}
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          hasContract: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hasContract"
                      className="text-sm font-medium text-blue-600 cursor-pointer"
                    >
                      Thêm hợp đồng ngay
                    </label>
                  </div>
                </div>

                {contractData.hasContract && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Mã hợp đồng <span className="text-red-500">*</span>
                        </label>
                        <input
                          required={contractData.hasContract}
                          type="text"
                          className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
                          value={contractData.contractCode}
                          onChange={(e) =>
                            setContractData({
                              ...contractData,
                              contractCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Giá trị (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                          required={contractData.hasContract}
                          type="number"
                          min={0}
                          className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
                          value={contractData.revenueAmount}
                          onChange={(e) =>
                            setContractData({
                              ...contractData,
                              revenueAmount: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Ngày ký
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
                          value={contractData.revenueDate}
                          onChange={(e) =>
                            setContractData({
                              ...contractData,
                              revenueDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          File đính kèm
                        </label>
                        <label className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-blue-300 rounded cursor-pointer bg-white hover:bg-blue-50 text-sm text-gray-600 transition">
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {contractData.contractFile ? (
                            <span className="flex items-center gap-2 text-green-600 truncate">
                              <FileCheck size={16} />{" "}
                              {contractData.contractFile.name}
                            </span>
                          ) : (
                            "Chọn file..."
                          )}
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Ghi chú
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
                        value={contractData.contractNote}
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            contractNote: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 rounded-b-xl shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            form="school-form"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition disabled:opacity-70 flex items-center shadow-md font-medium"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Đang lưu...
              </>
            ) : initialData ? (
              "Lưu thay đổi"
            ) : contractData.hasContract ? (
              "Lưu Trường & HĐ"
            ) : (
              "Thêm mới"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
