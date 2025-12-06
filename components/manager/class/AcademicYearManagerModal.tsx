import { managerClassService } from "@/services/manager/managerClass.service";
import { AcademicYearDto } from "@/types/academic-year";
import { Calendar, Edit2, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
  onRefresh: () => void;
}

export default function AcademicYearManagerModal({
  onClose,
  onRefresh,
}: Props) {
  const [years, setYears] = useState<AcademicYearDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    yearName: "",
    boardingStartDate: "",
    boardingEndDate: "",
  });

  const formatDisplayDate = (dateString?: string | null) => {
    if (!dateString)
      return <span className="text-gray-300 italic">--/--/----</span>;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime()))
        return <span className="text-red-300">Lỗi ngày</span>;

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return <span className="text-gray-300 italic">--/--/----</span>;
    }
  };

  const formatInputDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      setLoading(true);
      const data = await managerClassService.getAllAcademicYear();
      console.log("Dữ liệu niên khóa:", data);
      setYears(data);
    } catch (error) {
      toast.error("Lỗi tải danh sách niên khóa");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ yearName: "", boardingStartDate: "", boardingEndDate: "" });
  };

  const handleEdit = (year: AcademicYearDto) => {
    setEditingId(year.yearId);
    setFormData({
      yearName: year.yearName,
      boardingStartDate: formatInputDate(year.boardingStartDate),
      boardingEndDate: formatInputDate(year.boardingEndDate),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.yearName.trim())
      return toast.error("Tên niên khóa không được để trống");

    if (formData.boardingStartDate && formData.boardingEndDate) {
      if (
        new Date(formData.boardingStartDate) >
        new Date(formData.boardingEndDate)
      ) {
        return toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        yearName: formData.yearName,
        boardingStartDate: formData.boardingStartDate || undefined,
        boardingEndDate: formData.boardingEndDate || undefined,
      };

      if (editingId) {
        await managerClassService.updateAcademicYear(editingId, payload);
        toast.success("Cập nhật thành công");
      } else {
        await managerClassService.createAcademicYear(payload);
        toast.success("Tạo mới thành công");
      }

      await fetchYears();
      onRefresh();
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa niên khóa này?")) return;
    try {
      await managerClassService.deleteAcademicYear(id);
      toast.success("Đã xóa niên khóa");
      await fetchYears();
      onRefresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể xóa niên khóa này"
      );
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-orange-600" size={24} />
            Quản lý Niên Khóa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Cột trái: Form */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6 bg-white flex flex-col overflow-y-auto">
            <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-2">
              {editingId ? (
                <Edit2 size={18} className="text-blue-500" />
              ) : (
                <Calendar size={18} className="text-green-500" />
              )}
              {editingId ? "Cập nhật thông tin" : "Thêm niên khóa mới"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tên niên khóa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="VD: 2024-2025"
                  value={formData.yearName}
                  onChange={(e) =>
                    setFormData({ ...formData, yearName: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-600"
                    value={formData.boardingStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        boardingStartDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-600"
                    value={formData.boardingEndDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        boardingEndDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 rounded-lg text-white font-medium flex items-center justify-center gap-2 shadow-md transition-all ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  }`}
                >
                  {submitting ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <Save size={18} />{" "}
                      {editingId ? "Lưu thay đổi" : "Lưu lại"}
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Cột phải: Danh sách */}
          <div className="w-full md:w-2/3 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Danh sách hiện có ({years.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                    <tr>
                      <th className="px-4 py-3 w-1/3">Tên niên khóa</th>
                      <th className="px-4 py-3 w-1/3">Thời gian</th>
                      <th className="px-4 py-3 w-1/3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-gray-500"
                        >
                          <div className="animate-spin inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
                          <p>Đang tải dữ liệu...</p>
                        </td>
                      </tr>
                    ) : years.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-gray-400 flex flex-col items-center"
                        >
                          <Calendar size={48} className="text-gray-200 mb-2" />
                          Chưa có dữ liệu niên khóa
                        </td>
                      </tr>
                    ) : (
                      years.map((year) => (
                        <tr
                          key={year.yearId}
                          className={`transition-colors ${
                            editingId === year.yearId
                              ? "bg-orange-50 border-l-4 border-l-orange-500"
                              : "hover:bg-gray-50 border-l-4 border-l-transparent"
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {year.yearName}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-400 font-medium uppercase w-16">
                                  Bắt đầu:
                                </span>
                                <span className="text-gray-700 font-medium">
                                  {formatDisplayDate(year.boardingStartDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-400 font-medium uppercase w-16">
                                  Kết thúc:
                                </span>
                                <span className="text-gray-700 font-medium">
                                  {formatDisplayDate(year.boardingEndDate)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(year)}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(year.yearId)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
