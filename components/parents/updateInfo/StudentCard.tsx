import { User, Edit2, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export const StudentCard = ({
  student,
  onSelect,
}: {
  student: any;
  onSelect: (s: any) => void;
}) => (
  <div
    onClick={() => onSelect(student)}
    className="group bg-white rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-blue-50 text-blue-600 p-2 rounded-full">
        <Edit2 size={16} />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          {student.avatarUrl ? (
            <img
              src={getImageUrl(student.avatarUrl)}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-300">
              <User size={24} />
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
          {student.fullName}
        </h3>
        <p className="text-sm text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-md mt-1">
          Lớp: {student.className}
        </p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400">
      <span>Cập nhật hồ sơ</span>
      <ChevronRight size={16} />
    </div>
  </div>
);
