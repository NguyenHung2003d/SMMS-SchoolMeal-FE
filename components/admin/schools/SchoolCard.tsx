import React from "react";
import { SchoolDTO } from "@/types/admin-school";
import { Edit, Mail, MapPin, Phone, Trash2, Users } from "lucide-react";
import StatusSwitch from "./StatusSwitch";

interface SchoolCardProps {
  school: SchoolDTO;
  togglingId: string | null;
  onToggleStatus: (schoolId: string, currentStatus: boolean) => void;
  onOpenEditModal: (school: SchoolDTO) => void;
  onOpenDeleteModal: (id: string) => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  togglingId,
  onToggleStatus,
  onOpenEditModal,
  onOpenDeleteModal,
}) => {
  return (
    <div
      key={school.schoolId}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 p-5 relative flex flex-col"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            school.isActive ? "text-green-600" : "text-gray-400"
          }`}
        >
          {school.isActive ? "Active" : "Inactive"}
        </span>
        <StatusSwitch
          checked={school.isActive}
          isLoading={togglingId === school.schoolId}
          onChange={() => onToggleStatus(school.schoolId, school.isActive)}
        />
      </div>
      <div className="mb-4 pr-16">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
          {school.schoolName}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-gray-500">
          <div className="flex items-start">
            <MapPin
              size={14}
              className="mr-2 text-orange-500 mt-0.5 shrink-0"
            />
            <span className="line-clamp-2">
              {school.schoolAddress || "Chưa cập nhật địa chỉ"}
            </span>
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-2 text-orange-500 shrink-0" />
            <span>{school.hotline || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Mail size={14} className="mr-2 text-orange-500 shrink-0" />
            <span className="truncate">{school.contactEmail || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-gray-600">
          <Users size={16} className="mr-1.5 text-blue-500" />
          <span>{school.studentCount} học sinh</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            title="Chỉnh sửa"
            onClick={() => onOpenEditModal(school)}
            className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
          >
            <Edit size={16} />
          </button>

          {school.isActive && (
            <button
              title="Vô hiệu hóa (Xóa mềm)"
              onClick={() => onOpenDeleteModal(school.schoolId)}
              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;
