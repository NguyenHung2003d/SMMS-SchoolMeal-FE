import React from "react";
import { UserCircle } from "lucide-react";
import { Student } from "@/types/student";

interface StudentHeaderProps {
  student: Student;
  invoiceCount: number;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  invoiceCount,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full shadow-sm border-2 border-white ring-1 ring-blue-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
          <UserCircle size={32} className="text-blue-200" />
          {student.avatarUrl && (
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
            Học sinh
          </p>
          <p className="text-lg font-bold text-gray-800">{student.fullName}</p>
        </div>
      </div>
      {invoiceCount > 0 && (
        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
          {invoiceCount} khoản phí
        </span>
      )}
    </div>
  );
};
