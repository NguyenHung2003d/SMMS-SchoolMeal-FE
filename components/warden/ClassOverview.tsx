import React from "react";
import Link from "next/link";
import { Users, UserCheck, FileText } from "lucide-react";
import { ClassDto } from "@/types/warden";

interface ClassOverviewProps {
  classes: ClassDto[];
}

export const ClassOverview: React.FC<ClassOverviewProps> = ({ classes }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Tổng quan lớp học</h2>

      {classes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Chưa có dữ liệu lớp học.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.classId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{cls.className}</h3>
                  <p className="text-sm text-gray-600">
                    GVCN: {cls.wardenName}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {cls.shift || "Cả ngày"}
                </div>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Users size={16} className="text-gray-500 mr-2" />
                <span>{cls.totalStudents} học sinh</span>
              </div>
              <div className="flex items-center text-sm">
                <UserCheck size={16} className="text-green-500 mr-2" />
                <span>{cls.presentToday} có mặt hôm nay</span>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/wardens/classView?id=${cls.classId}`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText size={14} className="mr-1" />
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
