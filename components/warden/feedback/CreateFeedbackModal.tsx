import React, { useState, useEffect } from "react";
import { X, Send, Loader2, ChevronDown } from "lucide-react";

interface CreateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  submitting: boolean;
}

export const CreateFeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  submitting,
}: CreateFeedbackModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("food");
  const [severity, setSeverity] = useState("medium");
  const [student, setStudent] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setStudent(initialData.targetRef || "");
        setCategory(initialData.category || "food");
        setSeverity(initialData.severity || "medium");
      } else {
        // Reset form khi tạo mới
        setTitle("");
        setContent("");
        setCategory("food");
        setSeverity("medium");
        setStudent("");
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      targetType: category,
      severity,
      targetRef: student,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-orange-50 to-pink-50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {initialData ? "Chỉnh sửa báo cáo" : "Báo cáo vấn đề mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Chủ đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Nhập chủ đề vấn đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Nội dung chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Mô tả chi tiết..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Phân loại (Target Type)
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-orange-500 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="food">🍽️ Thức ăn (Food)</option>
                  <option value="facility">🏫 Cơ sở vật chất (Facility)</option>
                  <option value="health">❤️ Sức khỏe (Health)</option>
                  <option value="activity">🎨 Hoạt động (Activity)</option>
                  <option value="other">📋 Khác (Other)</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-[3.2rem] text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Mức độ
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-orange-500 outline-none"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="low">🟢 Thấp</option>
                  <option value="medium">🟡 Trung bình</option>
                  <option value="high">🔴 Cao</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-[3.2rem] text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Đối tượng liên quan (Học sinh/Món ăn)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="VD: Nguyễn Văn A hoặc Món cá kho..."
                value={student}
                onChange={(e) => setStudent(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <Send size={18} className="mr-2" />
              )}
              {submitting
                ? "Đang xử lý..."
                : initialData
                ? "Cập nhật"
                : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
