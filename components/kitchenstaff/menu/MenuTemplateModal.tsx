import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import { formatDate } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Loader2,
  X,
  Eye,
  ArrowLeft,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DAY_MAP, MEAL_MAP } from "@/helpers";

interface MenuTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: any) => void;
}

export default function MenuTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: MenuTemplateModalProps) {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [detailData, setDetailData] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMenus();
      setDetailData(null); // Reset view khi mở modal lại
    }
  }, [isOpen]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await kitchenMenuService.getAllMenus();
      const sorted = Array.isArray(data)
        ? data.sort((a: any, b: any) => b.menuId - a.menuId)
        : [];
      setMenus(sorted);
    } catch (error) {
      console.error("Lỗi tải danh sách menu mẫu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (menuId: number) => {
    try {
      setLoadingDetail(true);
      const detail = await kitchenMenuService.getMenuDetail(menuId);
      setDetailData(detail);
    } catch (error) {
      console.error("Lỗi lấy chi tiết menu:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmUse = () => {
    if (detailData) {
      onSelectTemplate(detailData);
      onClose();
    }
  };

  const handleBackToList = () => {
    setDetailData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {detailData ? (
              <button
                onClick={handleBackToList}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Calendar className="text-orange-600" size={20} />
            )}

            <h2 className="text-lg font-bold text-gray-800">
              {detailData
                ? `Chi tiết mẫu: Tuần ${detailData.weekNo} - Năm ${detailData.yearNo}`
                : "Chọn Menu Mẫu"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loadingDetail && (
            <div className="absolute inset-0 bg-white/80 z-20 flex justify-center items-center">
              <Loader2 className="animate-spin text-orange-600" size={40} />
            </div>
          )}

          {!detailData && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="animate-spin text-orange-500" />
                </div>
              ) : menus.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Chưa có menu mẫu nào.
                </p>
              ) : (
                <div className="space-y-3">
                  {menus.map((menu) => (
                    <div
                      key={menu.menuId}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all flex justify-between items-center group bg-white"
                    >
                      <div>
                        <h3 className="font-bold text-gray-700 text-lg">
                          Tuần {menu.weekNo} - Năm{" "}
                          {menu.yearNo || new Date().getFullYear()}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span>
                            Ngày tạo:{" "}
                            {menu.createdAt
                              ? formatDate(
                                  new Date(menu.createdAt),
                                  "dd/MM/yyyy"
                                )
                              : "N/A"}
                          </span>
                          {menu.notes && (
                            <span className="text-gray-300">|</span>
                          )}
                          {menu.notes && (
                            <span className="italic max-w-md truncate">
                              {menu.notes}
                            </span>
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => handleViewDetail(menu.menuId)}
                        className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <Eye size={18} />
                        Xem chi tiết
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {detailData && (
            <div className="space-y-6">
              {/* Note section */}
              {detailData.notes && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 italic">
                  Ghi chú: {detailData.notes}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[2, 3, 4, 5, 6].map((dayValue) => {
                  const dayItems =
                    detailData.days?.filter(
                      (d: any) => d.dayOfWeek === dayValue
                    ) || [];

                  return (
                    <div key={dayValue} className="flex flex-col gap-2">
                      <div className="text-center font-bold bg-gray-100 p-2 rounded text-gray-700">
                        {DAY_MAP[dayValue]}
                      </div>

                      {["Lunch", "SideDish"].map((mealType) => {
                        const mealData = dayItems.find(
                          (d: any) => d.mealType === mealType
                        );
                        const foods = mealData?.foodItems || [];

                        return (
                          <div
                            key={`${dayValue}-${mealType}`}
                            className={`p-2 rounded border min-h-[100px] text-sm ${
                              mealType === "Lunch"
                                ? "bg-orange-50/50 border-orange-100"
                                : "bg-green-50/50 border-green-100"
                            }`}
                          >
                            <div className="text-xs font-semibold uppercase text-gray-400 mb-1">
                              {MEAL_MAP[mealType]}
                            </div>
                            {foods.length > 0 ? (
                              <ul className="space-y-1.5">
                                {foods.map((f: any, idx: number) => (
                                  <li
                                    key={idx}
                                    className="flex gap-1.5 items-start"
                                  >
                                    <Utensils
                                      size={12}
                                      className="mt-1 text-gray-400 flex-shrink-0"
                                    />
                                    <span className="text-gray-700 line-clamp-2 leading-tight">
                                      {f.foodName}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-300 italic text-xs">
                                Không có món
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {detailData && (
          <div className="p-4 border-t bg-white rounded-b-xl flex justify-end gap-3 shadow-lg">
            <button
              onClick={handleBackToList}
              className="px-5 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              Chọn mẫu khác
            </button>
            <button
              onClick={handleConfirmUse}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Áp dụng Menu này
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
