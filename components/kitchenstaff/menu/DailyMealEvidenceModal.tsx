import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Save,
  AlertCircle,
} from "lucide-react";
import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { DailyMealActualIngredient } from "@/types/kitchen-menu";

interface Props {
  dailyMealId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const DailyMealEvidenceModal = ({
  dailyMealId,
  isOpen,
  onClose,
}: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [ingredients, setIngredients] = useState<DailyMealActualIngredient[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await kitchenMenuService.getDailyMealDetail(dailyMealId);
      setData(res);
      setIngredients(res.actualIngredients || []);
    } catch (error) {
      toast.error("Không thể tải chi tiết dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchDetail();
  }, [isOpen, dailyMealId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setUploading(true);
      await kitchenMenuService.uploadEvidence(dailyMealId, e.target.files[0]);
      toast.success("Tải lên ảnh mẫu thành công");
      fetchDetail();
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (evidenceId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ảnh mẫu này?")) return;
    try {
      await kitchenMenuService.deleteEvidence(evidenceId);
      toast.success("Đã xóa ảnh mẫu");
      fetchDetail();
    } catch (error) {
      toast.error("Lỗi khi xóa ảnh");
    }
  };

  const handleQtyChange = (id: number, val: number) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.ingredientId === id ? { ...item, actualQtyGram: val } : item
      )
    );
  };

  const handleNoteChange = (id: number, val: string) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.ingredientId === id ? { ...item, notes: val } : item
      )
    );
  };

  const handleSaveIngredients = async () => {
    for (const item of ingredients) {
      const original = data?.actualIngredients.find(
        (i: any) => i.ingredientId === item.ingredientId
      );
      const isChanged = item.actualQtyGram !== original?.actualQtyGram;
      if (isChanged && !item.notes?.trim()) {
        toast.error(
          `Vui lòng nhập lý do thay đổi định lượng cho "${item.ingredientName}"`
        );
        return;
      }
    }

    try {
      setIsSaving(true);
      await kitchenMenuService.updateActualIngredients(
        dailyMealId,
        ingredients
      );
      toast.success("Cập nhật thành công");
      fetchDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[75vh] overflow-hidden transition-all scale-in-center">
        <div className="p-5 border-b flex justify-between items-center bg-orange-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <ImageIcon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Lưu mẫu & Kiểm soát định lượng
              </h3>
              <p className="text-xs text-orange-600 font-medium">
                Ngày thực hiện:{" "}
                {data ? format(new Date(data.mealDate), "dd/MM/yyyy") : "---"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={40} />
              <p className="mt-3 text-gray-500">Đang tải dữ liệu thực đơn...</p>
            </div>
          ) : (
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest">
                    1. Hình ảnh mẫu thức ăn lưu kho
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-all group">
                    {uploading ? (
                      <Loader2
                        className="animate-spin text-orange-500"
                        size={24}
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload
                          className="text-gray-400 group-hover:text-orange-500 mb-1"
                          size={24}
                        />
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-orange-600 uppercase">
                          Thêm ảnh
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleUpload}
                      disabled={uploading}
                      accept="image/*"
                    />
                  </label>

                  {data?.evidences?.map((img: any) => (
                    <div
                      key={img.evidenceId}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 h-32 shadow-sm"
                    >
                      <img
                        src={img.fileUrl}
                        alt="Sample"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(img.evidenceId)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-5 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                    <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest">
                      2. Định lượng thực tế sử dụng (Gram)
                    </h4>
                  </div>
                  <button
                    onClick={handleSaveIngredients}
                    disabled={isSaving}
                    className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 active:scale-95 transition-all text-sm font-bold shadow-md disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    LƯU DỮ LIỆU
                  </button>
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Tên nguyên liệu</th>
                        <th className="px-6 py-4 text-center">Ước tính</th>
                        <th className="px-6 py-4 text-center w-32">
                          Thực tế (g)
                        </th>
                        <th className="px-6 py-4">Ghi chú / Lý do thay đổi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ingredients.map((item) => {
                        const original = data?.actualIngredients.find(
                          (i: any) => i.ingredientId === item.ingredientId
                        );
                        const isChanged =
                          item.actualQtyGram !== original?.actualQtyGram;

                        return (
                          <tr
                            key={item.ingredientId}
                            className={`transition-colors ${
                              isChanged ? "bg-blue-50/30" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4 font-semibold text-gray-700">
                              {item.ingredientName}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-500 font-medium">
                              {original?.estimatedQtyGram || 0}g
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={item.actualQtyGram}
                                onChange={(e) =>
                                  handleQtyChange(
                                    item.ingredientId,
                                    Number(e.target.value)
                                  )
                                }
                                className={`w-full text-center px-3 py-2 border rounded-xl font-bold focus:ring-2 focus:ring-orange-200 outline-none transition-all ${
                                  isChanged
                                    ? "border-blue-300 text-blue-700"
                                    : "border-gray-200 text-gray-700"
                                }`}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder={
                                    isChanged
                                      ? "Bắt buộc nhập lý do thay đổi ..."
                                      : "Ghi chú..."
                                  }
                                  value={item.notes || ""}
                                  onChange={(e) =>
                                    handleNoteChange(
                                      item.ingredientId,
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all ${
                                    isChanged && !item.notes?.trim()
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-100 focus:ring-orange-100"
                                  }`}
                                />
                                {isChanged && !item.notes?.trim() && (
                                  <AlertCircle
                                    size={18}
                                    className="text-red-500 animate-pulse shrink-0"
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
