import { kitchenMenuService } from "@/services/kitchenStaff/kitchenMenu.service";
import { formatDate } from "date-fns";
import { Calendar, CheckCircle, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [selectingId, setSelectingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMenus();
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

  const handleSelect = async (menuId: number) => {
    try {
      setSelectingId(menuId);
      const detail = await kitchenMenuService.getMenuDetail(menuId);
      onSelectTemplate(detail);
      onClose();
    } catch (error) {
      console.error("Lỗi lấy chi tiết menu:", error);
    } finally {
      setSelectingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-orange-600" size={20} />
            Chọn Menu Mẫu
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
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
                    <h3 className="font-bold text-gray-700">
                      Tuần {menu.weekNo} - Năm{" "}
                      {menu.yearNo || new Date().getFullYear()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ngày tạo:{" "}
                      {menu.createdAt
                        ? formatDate(new Date(menu.createdAt), "dd/MM/yyyy")
                        : "N/A"}
                    </p>
                    {menu.notes && (
                      <p className="text-xs text-gray-400 italic mt-1 max-w-md truncate">
                        Note: {menu.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelect(menu.menuId)}
                    disabled={selectingId !== null}
                    className="px-4 py-2 bg-white border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 font-medium flex items-center gap-2 transition-colors"
                  >
                    {selectingId === menu.menuId ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Dùng mẫu này
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
