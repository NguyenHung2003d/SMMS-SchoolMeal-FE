import { HelpCircle, Sparkles, LayoutTemplate } from "lucide-react";

interface Props {
  onOpenTemplate: () => void;
  onOpenAi: () => void;
  onStartTour: () => void;
}

export default function HeaderControl({
  onOpenTemplate,
  onOpenAi,
  onStartTour,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tạo thực đơn tuần</h1>
        <p className="text-sm text-gray-500">
          Thiết kế thực đơn cân bằng dinh dưỡng cho học sinh
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onStartTour}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all text-sm font-medium"
        >
          <HelpCircle size={18} />
          Hướng dẫn
        </button>

        <button
          id="step-template"
          onClick={onOpenTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all text-sm font-bold border border-blue-100"
        >
          <LayoutTemplate size={18} />
          Sử dụng mẫu
        </button>

        <button
          id="step-ai"
          onClick={onOpenAi}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-all text-sm font-bold border border-purple-100"
        >
          <Sparkles size={18} />
          AI gợi ý
        </button>
      </div>
    </div>
  );
}
