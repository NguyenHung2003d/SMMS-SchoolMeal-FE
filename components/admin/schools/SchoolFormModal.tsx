"use client";
import {
  CreateSchoolDto,
  SchoolDTO,
  SchoolRevenue,
  UpdateSchoolDto,
} from "@/types/admin-school";
import { X, FileCheck, Loader2, Edit, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { adminSchoolRevenueService } from "@/services/admin/adminRevenue.service";

interface ContractDataState {
  hasContract: boolean;
  contractCode: string;
  revenueAmount: number;
  revenueDate: string;
  contractNote: string;
  contractFile: File | null;
}

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    schoolData: CreateSchoolDto | UpdateSchoolDto,
    contractData?: any
  ) => Promise<void>;
  initialData?: SchoolDTO | null;
  isSubmitting: boolean;

  onContractUpdate: (
    revenueId: number,
    data: any,
    file?: File | null
  ) => Promise<void>;
  onContractDelete: (revenueId: number) => Promise<void>;
}

export default function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  onContractUpdate,
  onContractDelete,
}: SchoolFormModalProps) {
  const [schoolData, setSchoolData] = useState<CreateSchoolDto>({
    schoolName: "",
    contactEmail: "",
    hotline: "",
    schoolAddress: "",
    isActive: true,
  });

  const [contractData, setContractData] = useState<ContractDataState>({
    hasContract: false,
    contractCode: "",
    revenueAmount: 0,
    revenueDate: new Date().toISOString().split("T")[0],
    contractNote: "",
    contractFile: null,
  });

  const [currentRevenues, setCurrentRevenues] = useState<SchoolRevenue[]>([]);
  const [isRevenueLoading, setIsRevenueLoading] = useState(false);
  const [editingRevenueId, setEditingRevenueId] = useState<number | null>(null);
  const [revenueSubmittingId, setRevenueSubmittingId] = useState<number | null>(
    null
  );

  const fetchRevenues = useCallback(async (schoolId: string) => {
    if (!schoolId) return;
    setIsRevenueLoading(true);
    try {
      const data = await adminSchoolRevenueService.getBySchool(schoolId);
      setCurrentRevenues(data);
    } catch (error) {
      toast.error("Không thể tải danh sách hợp đồng.");
    } finally {
      setIsRevenueLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setSchoolData({
        schoolName: initialData.schoolName,
        contactEmail: initialData.contactEmail || "",
        hotline: initialData.hotline || "",
        schoolAddress: initialData.schoolAddress || "",
        isActive: initialData.isActive,
      });
      setContractData({
        hasContract: false,
        contractCode: "",
        revenueAmount: 0,
        revenueDate: new Date().toISOString().split("T")[0],
        contractNote: "",
        contractFile: null,
      });
      fetchRevenues(initialData.schoolId);
    } else {
      // Reset khi tạo mới
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
      setCurrentRevenues([]);
    }
    setEditingRevenueId(null);
  }, [initialData, isOpen, fetchRevenues]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      schoolData,
      !initialData && contractData.hasContract ? contractData : undefined
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractData({ ...contractData, contractFile: e.target.files[0] });
    }
  };

  const handleRevenueEdit = (revenue: SchoolRevenue) => {
    setEditingRevenueId(revenue.schoolRevenueId);
    setContractData({
      hasContract: true,
      contractCode: revenue.contractCode || "",
      revenueAmount: revenue.revenueAmount,
      revenueDate: revenue.revenueDate.split("T")[0],
      contractNote: revenue.contractNote || "",
      contractFile: null,
    });
  };

  const handleRevenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRevenueId || !initialData) return;

    setRevenueSubmittingId(editingRevenueId);
    try {
      const updateDto = {
        revenueId: editingRevenueId,
        schoolId: initialData.schoolId,
        revenueDate: contractData.revenueDate,
        revenueAmount: contractData.revenueAmount,
        contractCode: contractData.contractCode,
        contractNote: contractData.contractNote,
      };

      await onContractUpdate(
        editingRevenueId,
        updateDto,
        contractData.contractFile
      );

      await fetchRevenues(initialData.schoolId);
      setEditingRevenueId(null);
      toast.success("Cập nhật hợp đồng thành công!");
    } catch (error) {
      toast.error("Lỗi cập nhật hợp đồng.");
    } finally {
      setRevenueSubmittingId(null);
    }
  };

  const handleRevenueDelete = async (revenueId: number) => {
    if (!initialData) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này không?"))
      return;

    setRevenueSubmittingId(revenueId);
    try {
      await onContractDelete(revenueId);
      await fetchRevenues(initialData.schoolId);
      toast.success("Đã xóa hợp đồng thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa hợp đồng.");
    } finally {
      setRevenueSubmittingId(null);
    }
  };

  const isContractFormVisible =
    !initialData && contractData.hasContract;
  const isRevenueEditing = initialData && editingRevenueId !== null;

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
                {isContractFormVisible && (
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

          {initialData && (
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-700 border-l-4 border-blue-500 pl-2">
                Hợp đồng hiện tại
              </h3>
              {isRevenueLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : currentRevenues.length === 0 ? (
                <div className="text-sm text-gray-500 italic p-3 border border-dashed rounded-lg bg-gray-50">
                  Chưa có hợp đồng nào được thêm cho trường này.
                  <button
                    className="ml-2 text-blue-500 hover:underline font-medium"
                  >
                    Thêm ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentRevenues.map((revenue) => (
                    <div
                      key={revenue.schoolRevenueId}
                      className="p-3 border rounded-lg bg-blue-50 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-blue-800 truncate">
                          Mã HĐ: {revenue.contractCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          Giá trị:{" "}
                          <span className="font-medium text-orange-600">
                            {revenue.revenueAmount.toLocaleString("vi-VN")} VNĐ
                          </span>{" "}
                          (Ngày ký:{" "}
                          {new Date(revenue.revenueDate).toLocaleDateString(
                            "vi-VN"
                          )}
                          )
                        </p>
                        {revenue.contractFileUrl && (
                          <a
                            href={revenue.contractFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center mt-1"
                          >
                            <FileCheck size={14} className="mr-1" />
                            Xem file đính kèm
                          </a>
                        )}
                        {editingRevenueId === revenue.schoolRevenueId && (
                          <p className="text-xs text-red-500 mt-1">
                            Đang chỉnh sửa...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          title="Chỉnh sửa hợp đồng"
                          onClick={() => handleRevenueEdit(revenue)}
                          disabled={
                            revenueSubmittingId !== null ||
                            editingRevenueId !== null
                          }
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          title="Xóa hợp đồng"
                          onClick={() => handleRevenueDelete(revenue.schoolRevenueId)}
                          disabled={
                            revenueSubmittingId !== null ||
                            editingRevenueId !== null
                          }
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                        >
                          {revenueSubmittingId === revenue.schoolRevenueId ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isRevenueEditing && (
                <form
                  onSubmit={handleRevenueSubmit}
                  className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 space-y-4 animate-in fade-in slide-in-from-top-4"
                >
                  <h4 className="font-bold text-base text-blue-800">
                    Cập nhật Hợp đồng #{editingRevenueId}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Mã hợp đồng <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
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
                        required
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
                        Cập nhật File
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
                          <span className="text-gray-500">
                            Chọn file mới (Để trống nếu không đổi)
                          </span>
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
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingRevenueId(null)}
                      className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                      disabled={revenueSubmittingId === editingRevenueId}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm flex items-center"
                      disabled={revenueSubmittingId === editingRevenueId}
                    >
                      {revenueSubmittingId === editingRevenueId ? (
                        <Loader2 size={16} className="animate-spin mr-1" />
                      ) : (
                        "Lưu Hợp đồng"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
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
              "Lưu thông tin trường"
            ) : contractData.hasContract ? (
              "Lưu Trường & HĐ"
            ) : (
              "Thêm mới trường"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}